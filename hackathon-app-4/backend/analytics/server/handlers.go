package server

import (
	"encoding/json"
	_ "errors"
	"fmt"
	"net/http"
	_ "regexp"
	"strconv"
	"time"
)

//var validPath = regexp.MustCompile("^/(pages|edit|save)/([a-zA-Z0-9]+)$")

func IntializeHandlers() {
	http.HandleFunc("/ping", healthHandler)
	http.HandleFunc("/aggregated-statistics", aggregatedStatisticsHandler)
	http.HandleFunc("/single-investment-performance", singleInvestmentPerformanceHandler)
}

func aggregatedStatisticsHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	dateRequestedString := r.URL.Query().Get("date")
	if dateRequestedString == "" {
		dateRequestedString = time.Now().Format("2006-01-02")
	}

	// get all the investments aggregated statistics in the nearest month
	investmentsFromPreviousMonthEnd, err := getInvestmentsFromPreviousMonthEnd(dateRequestedString)
	if err != nil {
		fmt.Printf("(Error) aggregatedStatisticsHandler getInvestmentsFromPreviousMonthEnd failed : %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// retrieve all the transactions that were made in this month before aggregation date
	transactionsFromThisMonth, err := getTransactionsFromThisMonth(dateRequestedString)
	if err != nil {
		fmt.Printf("(Error) aggregatedStatisticsHandler getTransactionsFromThisMonth failed : %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// do aggregation on the above 2 values
	aggregatedInvestments := compute(investmentsFromPreviousMonthEnd, transactionsFromThisMonth)

	investedInstrumentIds := make([]int, 0)
	for _, investment := range aggregatedInvestments {
		investedInstrumentIds = append(investedInstrumentIds, investment.InstrumentId)
	}

	// get the necessary latest market valuations for each investment into a map
	latestMarketValuations := getSelectedLatestMarketValuationsByDate(investedInstrumentIds, dateRequestedString)

	// call the helper function. Sort and then return the statistics
	aggregatedStatistics := gatherInvestmentStatistics(aggregatedInvestments, latestMarketValuations)
	sortInvestmentStatisticsByROI(aggregatedStatistics)

	data, err := json.Marshal(aggregatedStatistics)
	if err != nil {
		fmt.Printf("(Error) aggregatedStatisticsHandler data marshalling failed : %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write(data)
}

type SingleInvestmentPerformanceResponse struct {
	InstrumentId     int     `json:"instrument_id"`
	TotalUnits       int     `json:"total_units"`
	TotalCost        float64 `json:"total_cost"`
	TotalMarketValue float64 `json:"total_market_value"`
}

func singleInvestmentPerformanceHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	startDateString := r.URL.Query().Get("start_date")
	if startDateString == "" {
		fmt.Printf("(Error) singleInvestmentPerformanceHandler start date field is empty\n")
		http.Error(w, "start date is empty", http.StatusBadRequest)
		return
	}

	endDateString := r.URL.Query().Get("end_date")
	if endDateString == "" {
		endDateString = time.Now().Format("2006-01-02")
	}

	instrumentIdString := r.URL.Query().Get("instrument_id")
	instrumentId, err := strconv.Atoi(instrumentIdString)
	if err != nil {
		fmt.Printf("(Error) singleInvestmentPerformanceHandler instrument id field is empty or invalid : input - [%v] %v\n", instrumentIdString, err)
		http.Error(w, "instrument id is empty or not valid", http.StatusBadRequest)
		return
	}

	investmentInformation, err := getLatestInvestmentInformationByDate(instrumentId, startDateString)
	if err != nil {
		fmt.Printf("(Error) singleInvestmentPerformanceHandler getLatestInvestmentInformationByDate failed : %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	marketValuationAtEndDate, err := getLatestMarketValuationByDate(instrumentId, endDateString)
	if err != nil {
		fmt.Printf("(Error) singleInvestmentPerformanceHandler market valuation information by end date not found\n")
		http.Error(w, "market valuation by end date not available", http.StatusBadRequest)
		return
	}

	singleInvestmentPerformance := &SingleInvestmentPerformanceResponse{
		InstrumentId:     instrumentId,
		TotalUnits:       investmentInformation.CumulativeQuantity,
		TotalCost:        investmentInformation.CumulativeTransactionAmount,
		TotalMarketValue: marketValuationAtEndDate,
	}

	data, err := json.Marshal(singleInvestmentPerformance)
	if err != nil {
		fmt.Printf("(Error) aggregatedStatisticsHandler data marshalling failed : %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write(data)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	w.Write([]byte("Server is healthy"))
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}