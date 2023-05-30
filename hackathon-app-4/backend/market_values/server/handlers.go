package server

import (
	"encoding/json"
	_ "errors"
	"fmt"
	"hackathon-app-4/backend/market_values/database"
	"net/http"
	_ "regexp"
	"strconv"
	"time"
)

//var validPath = regexp.MustCompile("^/(pages|edit|save)/([a-zA-Z0-9]+)$")

func IntializeHandlers() {
	http.HandleFunc("/market-values", marketValuesHandler)
	http.HandleFunc("/ping", healthHandler)
}

func marketValuesHandler(w http.ResponseWriter, r *http.Request) {

	var resp []byte
	enableCors(&w)

	instrumentID := r.URL.Query().Get("instrument_id")
	targetInstrumentId, err := strconv.Atoi(instrumentID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if targetInstrumentId == 0 {
		w.Write([]byte("error : instrument id not valid"))
		return
	}

	switch r.Method {
	case "GET":

		if beforeDate := r.URL.Query().Get("before_date"); beforeDate != "" {
			resp = processGetRequestWithDateLimit(targetInstrumentId, beforeDate)
		} else {
			resp = processGetRequest(targetInstrumentId)
		}

	case "POST":
		createReqAPIStruct := &MarketValuesAPIStruct{}
		err := json.NewDecoder(r.Body).Decode(&createReqAPIStruct)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		createReqAPIStruct.InstrumentId = targetInstrumentId
		resp = processCreateRequest(createReqAPIStruct)

	case "PUT":
		updateReqAPIStruct := &MarketValuesAPIStruct{}
		updateReqAPIStruct.InstrumentId = targetInstrumentId

		err = json.NewDecoder(r.Body).Decode(&updateReqAPIStruct)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		resp = processUpdateRequest(updateReqAPIStruct)
	}

	w.Write(resp)
}

func processGetRequest(instrumentId int) []byte {
	instrument, err := database.DB.GetMarketValuesForSpecificInstrumentID(instrumentId)
	if err != nil {
		fmt.Printf("(Error) getHandler : %v\n", err)
	}

	data, err := json.Marshal(instrument)
	if err != nil {
		fmt.Printf("(Error) getHandler data marshalling failed : %v\n", err)
	}

	return data
}

func processGetRequestWithDateLimit(instrumentId int, beforeDateStr string) []byte {
	beforeDate, err := time.Parse("2006-01-02", beforeDateStr)
	instrument, err := database.DB.GetLatestMarketValueForSpecificInstrumentIDBeforeDate(instrumentId, beforeDate)
	if err != nil {
		fmt.Printf("(Error) processGetRequestWithDateLimit : %v\n", err)
	}

	data, err := json.Marshal(instrument)
	if err != nil {
		fmt.Printf("(Error) processGetRequestWithDateLimit data marshalling failed : %v\n", err)
	}

	return data
}

//func processGetAllRequest() []byte {
//	fmt.Printf("Received a get all request\n")
//
//	marketValues, err := database.DB.GetAllMarketValues()
//	if err != nil {
//		fmt.Printf("(Error) getHandler : %v\n", err)
//	}
//
//	data, err := json.Marshal(marketValues)
//	if err != nil {
//		fmt.Printf("(Error) getHandler data marshalling failed : %v\n", err)
//	}
//
//	return data
//}

type MarketValuesAPIStruct struct {
	InstrumentId      int                          `json:"instrument_id"`
	MarketValueParams []*database.MarketValueParam `json:"market_values"`
}

func processCreateRequest(req *MarketValuesAPIStruct) []byte {
	fmt.Printf("Recevied create req: %+v\n", req)

	for _, marketValueParam := range req.MarketValueParams {
		if err := database.DB.AddMarketValue(req.InstrumentId, marketValueParam); err != nil {
			fmt.Printf("error in create request : %v\n", err)
		}
	}

	return []byte("create req completed")
}

func processUpdateRequest(req *MarketValuesAPIStruct) []byte {
	fmt.Printf("Recevied create req: %+v\n", req)
	database.DB.SaveMarketValue(req.InstrumentId, req.MarketValueParams)
	return []byte("update req completed")
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Server is healthy"))
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}
