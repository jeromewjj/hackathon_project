package server

import (
	"encoding/json"
	_ "errors"
	"fmt"
	"instruments/database"
	"net/http"
	_ "regexp"
	"strconv"
	"time"
)

//var validPath = regexp.MustCompile("^/(pages|edit|save)/([a-zA-Z0-9]+)$")

func IntializeHandlers() {
	http.HandleFunc("/instruments", instrumentsHandler)
	http.HandleFunc("/ping", healthHandler)
}

func instrumentsHandler(w http.ResponseWriter, r *http.Request) {
	var resp []byte
	enableCors(&w)

	instrumentID := r.URL.Query().Get("instrument_id")

	switch r.Method {
	case "GET":
		if instrumentID == "" {
			resp = processGetAllRequest()
		} else {
			targetInstrumentId, err := strconv.Atoi(instrumentID)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}

			resp = processGetRequest(targetInstrumentId)
		}

	case "POST":
		createReqAPIStruct := &InstrumentAPIStruct{}
		err := json.NewDecoder(r.Body).Decode(&createReqAPIStruct)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		resp = processCreateRequest(createReqAPIStruct)

	case "PUT":
		targetInstrumentId, err := strconv.Atoi(instrumentID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		updateReqAPIStruct := &InstrumentAPIStruct{}
		updateReqAPIStruct.InstrumentId = targetInstrumentId

		err = json.NewDecoder(r.Body).Decode(&updateReqAPIStruct)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		resp = processUpdateRequest(updateReqAPIStruct)

	case "DELETE":
		targetInstrumentId, err := strconv.Atoi(instrumentID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		resp = processDeleteRequest(targetInstrumentId)
	}

	w.Write(resp)
}

func processGetRequest(instrumentId int) []byte {
	instrument, err := database.DB.GetInstrument(instrumentId)
	if err != nil {
		fmt.Printf("(Error) getHandler : %v\n", err)
	}

	data, err := json.Marshal(instrument)
	if err != nil {
		fmt.Printf("(Error) getHandler data marshalling failed : %v\n", err)
	}

	return data
}

func processGetAllRequest() []byte {
	fmt.Printf("Received a get all request\n")

	instruments, err := database.DB.GetAllInstruments()
	if err != nil {
		fmt.Printf("(Error) getHandler : %v\n", err)
	}

	data, err := json.Marshal(instruments)
	if err != nil {
		fmt.Printf("(Error) getHandler data marshalling failed : %v\n", err)
	}

	fmt.Println(string(data))

	return data
}

type InstrumentAPIStruct struct {
	InstrumentId       int    `json:"instrument_id"`
	InstrumentName     string `json:"instrument_name"`
	InstrumentType     string `json:"instrument_type"`
	Country            string `json:"country"`
	Sector             string `json:"sector"`
	InstrumentCurrency string `json:"instrument_currency"`
	IsTradeable        bool   `json:"is_tradeable"`
	Notes              string `json:"notes"`
}

func processCreateRequest(req *InstrumentAPIStruct) []byte {
	fmt.Printf("Recevied create req: %+v\n", req)

	instrument := &database.Instrument{
		InstrumentName:     req.InstrumentName,
		InstrumentType:     database.InstrumentType(req.InstrumentType),
		Country:            req.Country,
		Sector:             req.Sector,
		InstrumentCurrency: req.InstrumentCurrency,
		IsTradeable:        req.IsTradeable,
		Notes:              req.Notes,
		CreatedAt:          time.Now(),
		ModifiedAt:         time.Now(),
	}

	if err := database.DB.AddInstrument(instrument); err != nil {
		return []byte(fmt.Sprintf("error : %s", err))
	} else {
		return []byte("success")
	}
}

func processUpdateRequest(req *InstrumentAPIStruct) []byte {
	fmt.Printf("Recevied update req: %+v\n", req)

	instrument := &database.Instrument{
		InstrumentId:       req.InstrumentId,
		InstrumentName:     req.InstrumentName,
		InstrumentType:     database.InstrumentType(req.InstrumentType),
		Country:            req.Country,
		Sector:             req.Sector,
		InstrumentCurrency: req.InstrumentCurrency,
		IsTradeable:        req.IsTradeable,
		Notes:              req.Notes,
	}

	if err := database.DB.SaveInstrument(instrument); err != nil {
		return []byte(fmt.Sprintf("error : %s", err))
	} else {
		return []byte("success")
	}
}

func processDeleteRequest(instrumentID int) []byte {
	fmt.Printf("Recevied delete req: %+v\n", instrumentID)
	database.DB.DeleteInstrument(instrumentID)
	return []byte("ok")

}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	w.Write([]byte("Server is healthy"))
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "*")
}
