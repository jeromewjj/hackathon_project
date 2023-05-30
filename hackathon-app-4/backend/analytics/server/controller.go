package server

import (
	"fmt"
	"sort"
)

type InvestmentStatistics struct {
	InstrumentId         int     `json:"instrument_id"`
	InstrumentName       string  `json:"instrument_name"`
	TotalCostTransacted  float64 `json:"total_cost_transacted"`
	LatestTotalValuation float64 `json:"latest_total_valuation"`
}

func gatherInvestmentStatistics(investments []*Investment, marketValues map[int]float64) []*InvestmentStatistics {

	res := make([]*InvestmentStatistics, 0)

	for _, investment := range investments {

		singularMarketValue, ok := marketValues[investment.InstrumentId]
		if !ok {
			fmt.Printf("No market value found for instrument id %v\n", investment.InstrumentId)
		}

		instrumentName, err := getInstrumentNameFromInstrumentID(investment.InstrumentId)
		if err != nil {
			fmt.Printf("No instrument name found for instrument id %v\n", investment.InstrumentId)
		}

		investmentStatistics := &InvestmentStatistics{
			InstrumentId:         investment.InstrumentId,
			InstrumentName:       instrumentName,
			TotalCostTransacted:  investment.CumulativeTransactionAmount,
			LatestTotalValuation: float64(investment.CumulativeQuantity) * singularMarketValue,
		}

		res = append(res, investmentStatistics)
	}

	return res
}

func sortInvestmentStatisticsByROI(investmentStatistics []*InvestmentStatistics) []*InvestmentStatistics {
	// sort by latest valuation, desc order
	sort.SliceStable(investmentStatistics, func(i, j int) bool {
		roiI := float64((investmentStatistics[i].LatestTotalValuation - investmentStatistics[i].TotalCostTransacted) / investmentStatistics[i].TotalCostTransacted)
		roiJ := float64((investmentStatistics[j].LatestTotalValuation - investmentStatistics[j].TotalCostTransacted) / investmentStatistics[j].TotalCostTransacted)

		return roiJ < roiI
	})

	return investmentStatistics
}

//func getPEFromInvestment(investment *Investment, newMarketValue float64) float64 {
//	return newMarketValue*float64(investment.CumulativeQuantity) - investment.CumulativeTransactionAmount
//}

func compute(investments []*Investment, transactions []*Transaction) []*Investment {
	investmentsMap := make(map[int]*Investment)
	for _, investment := range investments {
		investmentsMap[investment.InstrumentId] = investment
	}

	for _, transaction := range transactions {

		if transaction.TransactionType == "BUY" {
			investment, ok := investmentsMap[transaction.InstrumentId]
			if !ok {
				investment = &Investment{
					InstrumentId:                transaction.InstrumentId,
					CumulativeQuantity:          transaction.Quantity,
					CumulativeTransactionAmount: transaction.TransactionAmount,
				}
				investmentsMap[transaction.InstrumentId] = investment
			}

			if investment == nil {
				fmt.Printf("(error) No investment found for instrument id %v\n", transaction.InstrumentId)
				continue
			}

			investment.CumulativeQuantity += transaction.Quantity
			investment.CumulativeTransactionAmount += transaction.TransactionAmount
		} else if transaction.TransactionType == "SELL" {
			investment, ok := investmentsMap[transaction.InstrumentId]
			if !ok {
				fmt.Printf("(error) No investment found for instrument id %v\n", transaction.InstrumentId)
			}

			if investment == nil {
				fmt.Printf("(error) No investment found for instrument id %v\n", transaction.InstrumentId)
				continue
			}

			investment.CumulativeQuantity -= transaction.Quantity
			investment.CumulativeTransactionAmount += transaction.TransactionAmount
		}

	}

	return investments
}
