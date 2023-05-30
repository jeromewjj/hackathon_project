package server

import (
	"encoding/json"
	"errors"
	_ "errors"
	"fmt"
	"investments/database"
	"net/http"
	_ "regexp"
	"strconv"
	"time"

	"gorm.io/gorm"
)

//var validPath = regexp.MustCompile("^/(pages|edit|save)/([a-zA-Z0-9]+)$")

func IntializeHandlers() {
	http.HandleFunc("/investments/refresh", investmentsRefreshHandler)
	http.HandleFunc("/investments", investmentsGetHandler)
	http.HandleFunc("/ping", healthHandler)
}

func investmentsGetHandler(w http.ResponseWriter, r *http.Request) {
	var resp []byte
	enableCors(&w)

	switch r.Method {
	case "GET":
		instrumentId := r.URL.Query().Get("instrument_id")
		fmt.Println("Received /investments request for", instrumentId)

		if instrumentId == "" {
			var err error

			fmt.Println(r.URL.Query())

			if startDateStr := r.URL.Query().Get("start_date"); startDateStr != "" {
				if endDateStr := r.URL.Query().Get("end_date"); endDateStr != "" {
					resp, err = processGetRequestWithTimePeriod(startDateStr, endDateStr)
					if err != nil {
						resp = []byte(fmt.Sprintf("error : %v", err))
						break
					}
				} else {
					resp = []byte("error : missing end date")
					break
				}
			} else {
				http.Error(w, "Missing input instrument id", http.StatusBadRequest)
				return
			}

		} else {
			targetInstrumentId, err := strconv.Atoi(instrumentId)
			if err != nil {
				resp = []byte(fmt.Sprintf("%v", err))
				break
			}

			if beforeDateStr := r.URL.Query().Get("before_date"); beforeDateStr != "" {
				resp, err = processGetRequestWithDateLimit(targetInstrumentId, beforeDateStr)
				if err != nil {
					resp = []byte(fmt.Sprintf("%v", err))
					break
				}
			} else {
				resp = processGetRequest(targetInstrumentId)
			}
		}
	}

	w.Write(resp)
}

func investmentsRefreshHandler(w http.ResponseWriter, r *http.Request) {
	var resp []byte
	enableCors(&w)

	switch r.Method {
	case "POST":
		// instrumentId := r.URL.Query().Get("instrument_id")
		r.ParseForm() // Parses the request body
		instrumentId := r.Form.Get("instrument_id")
		fmt.Println("Received /investments/refresh request for", instrumentId)

		if instrumentId == "" {
			http.Error(w, "Missing input instrument id", http.StatusBadRequest)
			return
		} else {
			targetInstrumentId, err := strconv.Atoi(instrumentId)
			if err != nil {
				resp = []byte(fmt.Sprintf("%v", err))
				break
			}

			resp = processRefreshRequest(targetInstrumentId)
		}
	}
	w.Write(resp)
}

func processGetRequest(instrumentId int) []byte {
	investments, err := database.DB.GetInvestmentsByInstrumentId(instrumentId)
	if err != nil {
		fmt.Printf("(Error) getHandler : %v\n", err)
	}

	data, err := json.Marshal(investments)
	if err != nil {
		fmt.Printf("(Error) getHandler data marshalling failed : %v\n", err)
	}

	return data
}

func processGetRequestWithTimePeriod(startDateStr, endDateStr string) ([]byte, error) {
	startDate, startDateErr := time.Parse("2006-01-02", startDateStr)
	endDate, endDateErr := time.Parse("2006-01-02", endDateStr)
	if startDateErr != nil || endDateErr != nil {
		return nil, errors.New("invalid date format")
	}

	investments, err := database.DB.GetInvestmentsByInstrumentIdWithinPeriod(startDate, endDate)
	if err != nil {
		fmt.Printf("(Error) getHandler : %v\n", err)
	}

	data, err := json.Marshal(investments)
	if err != nil {
		fmt.Printf("(Error) getHandler data marshalling failed : %v\n", err)
	}

	return data, nil
}

func processGetRequestWithDateLimit(instrumentId int, beforeDateStr string) ([]byte, error) {
	beforeDate, err := time.Parse("2006-01-02", beforeDateStr)
	if err != nil {
		return nil, err
	}

	investments, err := database.DB.GetLatestInvestmentByInstrumentIdBeforeSetDate(instrumentId, beforeDate)
	if err != nil {
		fmt.Printf("(Error) processGetRequestWithDateLimit : %v\n", err)
	}

	data, err := json.Marshal(investments)
	if err != nil {
		fmt.Printf("(Error) processGetRequestWithDateLimit data marshalling failed : %v\n", err)
	}

	return data, nil
}

func processRefreshRequest(instrumentId int) []byte {
	// get the latest (refreshed date) investment by instrumentId
	var lastRefreshedDate time.Time
	cumuQuantity := 0
	var cumuAmount float64 = 0
	latestInv, err := database.DB.GetLatestInvestmentByInstrumentId(instrumentId)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return []byte(fmt.Sprintf("error : %s", err))
	} else if err == nil {
		lastRefreshedDate = latestInv.RefreshDatetime
		cumuQuantity = latestInv.CumulativeQuantity
		cumuAmount = latestInv.CumulativeTransactionAmount
	}
	// else err != nil && errors.Is(err, gorm.ErrRecordNotFound)
	// which means no inv with instrumentId exists, last refreshDatetime is taken to be nil

	// based on the last refreshDatetime,
	// get all transactions of the instrumentId, filtered by everything later than the last refreshDatetime (if it's null, then just no filter)
	var transactions []*database.Transaction
	if !lastRefreshedDate.IsZero() {
		transactions, err = database.DB.GetTransactionsByInstrumentIdAfterDate(instrumentId, lastRefreshedDate)
	} else {
		transactions, err = database.DB.GetTransactionsByInstrumentId(instrumentId)
	}
	if err != nil {
		return []byte(fmt.Sprintf("error : %s", err))
	}

	var currDt time.Time
	if !lastRefreshedDate.IsZero() {
		currDt = lastRefreshedDate
	} else {
		currDt = transactions[0].TransactionDate
	}

	// starting from the earliest of these transactions, maintain cumulative
	// - sum up the transactions within a single month, adding on to previous month's cumulative
	for _, tran := range transactions {
		td := tran.TransactionDate
		if td.Year() == currDt.Year() && td.Month() == currDt.Month() {
			cumuQuantity += tran.Quantity
			cumuAmount += tran.TransactionAmount
		} else {
			// some new month, so we update investment db table with cumu so far
			lastDateOfMonth := time.Date(currDt.Year(), time.Month(currDt.Month()+1), 0, 0, 0, 0, 0, time.UTC)
			inv := &database.Investment{
				InstrumentId:                instrumentId,
				CumulativeQuantity:          cumuQuantity,
				CumulativeTransactionAmount: cumuAmount,
				RefreshDatetime:             lastDateOfMonth,
				// CreatedAt:                   time.Now(),
			}
			if err := insertEveryMonthInv(td, inv); err != nil {
				return []byte(fmt.Sprintf("error : %s", err))
			}

			// update for loop value
			currDt = td
		}

	}

	return []byte("success")
}

func insertEveryMonthInv(endingDt time.Time, inv *database.Investment) error {
	fmt.Println("insertevermonth, endingdt:", endingDt)
	for !isSameMonth(endingDt, inv.RefreshDatetime) {
		fmt.Println("Trying to upsert:", inv)
		// upsert into investments table because we hit the next month. upsert covers 2 cases
		// case 1: update the latest investment row (because month is not over yet)
		// case 2: add new investment row
		if err := database.DB.UpsertInvestment(inv); err != nil {
			return err
		}

		// increment month
		year := inv.RefreshDatetime.Year()
		month := inv.RefreshDatetime.Month()
		nextDt := time.Date(year, month+2, 1, -24, 0, 0, 0, time.UTC)
		fmt.Println(inv.RefreshDatetime)
		fmt.Println(nextDt)
		inv.RefreshDatetime = nextDt
	}
	// for the final, incomplete month
	inv.RefreshDatetime = endingDt
	if err := database.DB.UpsertInvestment(inv); err != nil {
		return err
	}

	return nil
}

func isSameMonth(dtOne time.Time, dtTwo time.Time) bool {
	return (dtTwo.Year() == dtOne.Year() && dtTwo.Month() == dtOne.Month())
	// (dtTwo.Year() == dtOne.Year()+1 && dtTwo.Month() == 1 && dtOne.Month() == 12))
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	w.Write([]byte("Server is healthy"))
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}
