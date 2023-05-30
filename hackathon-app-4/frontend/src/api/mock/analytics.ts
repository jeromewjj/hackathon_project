import { Success, Err } from "../../utils";
import { InvestmentStatistics } from "../types/analytics.type";

const MOCK_DATA: InvestmentStatistics[] = [{
  "instrument_id": 1,
  "total_cost_transacted": 100,
  latest_total_valuation: 100
},
{
  "instrument_id": 2,
  "total_cost_transacted": 2000,
  latest_total_valuation: 1200
}]

async function breakdownAll(date: Date): Promise<Success<InvestmentStatistics[]> | Err> {
  return {
    data: MOCK_DATA, err: null
  }
}

async function breakdownOne(investmentId: number): Promise<Success<InvestmentStatistics> | Err> {
  return {
    data: MOCK_DATA[0], err: null
  }
}

export default {
  breakdownAll,
  breakdownOne
}