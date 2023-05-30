package server

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

// URL for all the other dependent backend microservices
const (
	InvestmentsURL  = "http://investments-dev2.ap-southeast-1.elasticbeanstalk.com"
	MarketValuesURL = "http://market-values-dev2.ap-southeast-1.elasticbeanstalk.com"
	TransactionsURL = "http://transactions-dev2.ap-southeast-1.elasticbeanstalk.com"
	InstrumentsURL  = "http://instruments-dev2.ap-southeast-1.elasticbeanstalk.com"
)

type Investment struct {
	InstrumentId                int     `json:"instrument_id"`
	CumulativeQuantity          int     `json:"cumulative_quantity"`
	CumulativeTransactionAmount float64 `json:"cumulative_transaction_amount"`
}

func getInvestmentsFromPreviousMonthEnd(dateRequestedString string) ([]*Investment, error) {
	results := make([]*Investment, 0)

	resp, err := http.Get(fmt.Sprintf("%s/investments?start_date=%s&end_date=%s", InvestmentsURL, getStartOfMonthDateString(dateRequestedString), dateRequestedString))
	if err != nil {
		fmt.Printf("(error) getInvestmentsFromPreviousMonthEnd : failed to get investments from investments service : %v\n", err)
		return nil, err
	}

	respData, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("(error) getInvestmentsFromPreviousMonthEnd : failed to read investments response : %v\n", err)
		return nil, err
	}

	fmt.Println(string(respData))

	if err := json.Unmarshal(respData, &results); err != nil {
		fmt.Printf("(error) getInvestmentsFromPreviousMonthEnd : failed to unmarshal investments response : %v\n", err)
		return nil, err
	}

	return results, nil
}

type Transaction struct {
	InstrumentId      int     `json:"instrument_id"`
	Quantity          int     `json:"quantity"`
	TransactionAmount float64 `json:"transaction_amount"`
	TransactionType   string  `json:"transaction_type"`
}

func getTransactionsFromThisMonth(dateRequestedString string) ([]*Transaction, error) {
	results := make([]*Transaction, 0)

	startDate := getStartOfMonthDateString(dateRequestedString)
	resp, err := http.Get(fmt.Sprintf("%s/transactions?start_date=%s&end_date=%s", TransactionsURL, startDate, dateRequestedString))
	if err != nil {
		fmt.Printf("(error) getTransactionsFromThisMonth : failed to get transactions from transactions service : %v\n", err)
		return nil, err
	}

	respData, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("(error) getTransactionsFromThisMonth : failed to read transactions response : %v\n", err)
		return nil, err
	}

	fmt.Println("Response : ", string(respData))

	if err := json.Unmarshal(respData, &results); err != nil {
		fmt.Printf("(error) getTransactionsFromThisMonth : failed to unmarshal transactions response : %v\n", err)
		return nil, err
	}

	return results, nil
}

type GetInstrumentDetailsStruct struct {
	InstrumentId   int    `json:"instrument_id"`
	InstrumentName string `json:"instrument_name"`
}

func getInstrumentNameFromInstrumentID(instrumentId int) (string, error) {
	results := &GetInstrumentDetailsStruct{}

	resp, err := http.Get(fmt.Sprintf("%s/instruments?instrument_id=%v", InstrumentsURL, instrumentId))
	if err != nil {
		fmt.Printf("(error) getInstrumentNameFromInstrumentID : failed to get instrument name from instrument service : %v\n", err)
		return "", err
	}

	respData, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("(error) getInstrumentNameFromInstrumentID : failed to get response from instrument service : %v", err)
		return "", err
	}

	fmt.Println("Response : ", string(respData))

	if err := json.Unmarshal(respData, &results); err != nil {
		fmt.Printf("(error) getTransactionsFromThisMonth : failed to unmarshal transactions response : %v\n", err)
		return "", err
	}

	return results.InstrumentName, nil
}

func getStartOfMonthDateString(date string) string {
	dateToken := strings.Split(date, "-")
	if len(dateToken) != 3 {
		fmt.Printf("(error) returnStartOfMonthDateString : invalid date format : %s\n", date)
		return ""
	}

	dateToken[2] = "01"
	return strings.Join(dateToken, "-")
}

type MarketValuation struct {
	InstrumentId int     `json:"instrument_id"`
	MarketValue  float64 `json:"market_value"`
}

func getSelectedLatestMarketValuationsByDate(selectedInstrumentIds []int, dateRequestedString string) map[int]float64 {
	results := make(map[int]float64)

	for _, instrumentId := range selectedInstrumentIds {
		resp, err := http.Get(fmt.Sprintf("%s/market-values?instrument_id=%d&before_date=%s", MarketValuesURL, instrumentId, dateRequestedString))
		if err != nil {
			fmt.Printf("(error) getSelectedLatestMarketValuationsByDate : failed to get market values from market values service for %v: %v\n",
				instrumentId, err)
		}

		respData, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Printf("(error) getSelectedLatestMarketValuationsByDate : failed to read market values response for instrument_id %v: %v\n",
				instrumentId, err)
		}

		var result MarketValuation
		if err := json.Unmarshal(respData, &result); err != nil {
			fmt.Printf("(error) getSelectedLatestMarketValuationsByDate : failed to unmarshal market values response for instrument_id %v: %v\n", instrumentId, err)
		}

		results[instrumentId] = result.MarketValue
	}

	return results
}

func getLatestMarketValuationByDate(instrumentId int, dateRequestedString string) (float64, error) {
	instrumentIdArr := []int{instrumentId}

	results := getSelectedLatestMarketValuationsByDate(instrumentIdArr, dateRequestedString)
	if len(results) == 0 {
		return 0, fmt.Errorf("(error) getLatestMarketValuationByDate : failed to get market value for instrument_id %v before %v\n", instrumentId, dateRequestedString)
	}

	return results[instrumentId], nil
}

func getLatestInvestmentInformationByDate(instrumentId int, dateRequestedString string) (*Investment, error) {
	resp, err := http.Get(fmt.Sprintf("%s/investments?id=%d&before_date=%s", InvestmentsURL, instrumentId, dateRequestedString))
	if err != nil {
		fmt.Printf("(error) getLatestInvestmentInformationByDate : failed to get investments from investments service for %v: %v\n", instrumentId, err)
		return nil, err
	}

	respData, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("(error) getLatestInvestmentInformationByDate : failed to read investments response for instrument_id %v: %v\n", instrumentId, err)
		return nil, err
	}

	fmt.Println("Response : ", string(respData))

	var result Investment
	if err := json.Unmarshal(respData, &result); err != nil {
		fmt.Printf("(error) getLatestInvestmentInformationByDate : failed to unmarshal investments response for instrument_id %v: %v\n", instrumentId, err)
		return nil, err
	}

	return &result, nil
}
