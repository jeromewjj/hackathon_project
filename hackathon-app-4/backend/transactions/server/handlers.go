package server

import (
	"encoding/json"
	_ "errors"
	"fmt"
	"net/http"
	_ "regexp"
	"strconv"
	"time"
	"transactions/database"
)

//var validPath = regexp.MustCompile("^/(pages|edit|save)/([a-zA-Z0-9]+)$")

func IntializeHandlers() {
	http.HandleFunc("/transactions", transactionsHandler)
	//http.HandleFunc("/transactions", transactionsHandler)
	http.HandleFunc("/ping", healthHandler)
}

func transactionsHandler(w http.ResponseWriter, r *http.Request) {

	var resp []byte
	enableCors(&w)

	transactionID := r.URL.Query().Get("transaction_id")

	switch r.Method {
	case "GET":
		if transactionID == "" {
			// Check if start and end date are present
			if startDateStr := r.URL.Query().Get("start_date"); startDateStr != "" {
				if endDateStr := r.URL.Query().Get("end_date"); endDateStr != "" {
					var err error

					resp, err = processGetAllRequestWithTimePeriod(startDateStr, endDateStr)
					if err != nil {
						resp = []byte(fmt.Sprintf("error : %v", err))
						break
					}
				} else {
					resp = []byte("error : missing end date")
					break
				}
			} else { // else get all transactions
				resp = processGetAllRequest()
			}
		} else {
			targetTransactionId, err := strconv.Atoi(transactionID)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}

			resp = processGetRequest(targetTransactionId)
		}

	case "POST":
		createReqAPIStruct := &TransactionAPIStruct{}
		err := json.NewDecoder(r.Body).Decode(&createReqAPIStruct)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		resp = processCreateRequest(createReqAPIStruct)

	case "DELETE":
		targetTransactionId, err := strconv.Atoi(transactionID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		resp = processDeleteRequest(targetTransactionId)
	}

	w.Write(resp)
}

func processGetRequest(transactionId int) []byte {
	transaction, err := database.DB.GetTransaction(transactionId)
	if err != nil {
		fmt.Printf("(Error) getHandler : %v\n", err)
	}

	data, err := json.Marshal(transaction)
	if err != nil {
		fmt.Printf("(Error) getHandler data marshalling failed : %v\n", err)
	}

	return data
}

func processGetAllRequest() []byte {
	fmt.Printf("Received a get all request\n")

	transactions, err := database.DB.GetAllTransactions()
	if err != nil {
		fmt.Printf("(Error) getHandler : %v\n", err)
	}

	data, err := json.Marshal(transactions)
	if err != nil {
		fmt.Printf("(Error) getHandler data marshalling failed : %v\n", err)
	}

	return data
}

func processGetAllRequestWithTimePeriod(startDateStr, endDateStr string) ([]byte, error) {
	fmt.Printf("Received a get all request\n")

	startDate, err := time.Parse("2006-01-02", startDateStr)
	if err != nil {
		return nil, err
	}
	endDate, err := time.Parse("2006-01-02", endDateStr)
	if err != nil {
		return nil, err
	}

	transactions, err := database.DB.GetAllTransactionsWithTimePeriod(startDate, endDate)
	if err != nil {
		fmt.Printf("(Error) getHandler : %v\n", err)
	}

	data, err := json.Marshal(transactions)
	if err != nil {
		fmt.Printf("(Error) getHandler data marshalling failed : %v\n", err)
	}

	return data, nil
}

type TransactionAPIStruct struct {
	InstrumentId      int     `json:"instrument_id"`
	Quantity          int     `json:"quantity"`
	TransactionDate   string  `json:"transaction_date"`
	TransactionAmount float64 `json:"transaction_amount"`
	TransactionType   string  `json:"transaction_type"`
}

func processCreateRequest(req *TransactionAPIStruct) []byte {
	fmt.Printf("Received create req: %+v\n", req)

	tDate, err := time.Parse("2006-01-02 15:04:05", req.TransactionDate)
	if err != nil {
		return ([]byte(fmt.Sprintf("error : %s", err)))
	}

	transaction := &database.Transaction{
		InstrumentId:      req.InstrumentId,
		Quantity:          req.Quantity,
		TransactionDate:   tDate,
		TransactionAmount: req.TransactionAmount,
		TransactionType:   database.TransactionType(req.TransactionType),
		CreatedAt:         time.Now(),
		ModifiedAt:        time.Now(),
	}

	if err := database.DB.AddTransaction(transaction); err != nil {
		return ([]byte(fmt.Sprintf("error : %s", err)))
	}
	return ([]byte("success"))
}

func processDeleteRequest(transactionId int) []byte {
	fmt.Printf("Recevied delete req: %+v\n", transactionId)
	if err := database.DB.DeleteTransaction(transactionId); err != nil {
		return []byte(fmt.Sprintf("error : %s", err))
	}
	return []byte("success")

}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	w.Write([]byte("Server is healthy"))
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "*")
}
