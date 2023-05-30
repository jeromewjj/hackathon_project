import axios from "axios";
import ENV from "../../env";
import { Success, Err } from "../../utils";
import { InvestmentStatistics } from "../types/analytics.type";

const BASE_URL = ENV.ANALYTICS_API

async function breakdownAll(date: Date): Promise<Success<InvestmentStatistics[]> | Err> {
  return await axios.get(`${BASE_URL}/aggregated-statistics?date=2022-09-01`).then(res => ({ data: res.data, err: null })).catch(err => ({ data: null, err }))
}

async function breakdownOne(id: number): Promise<Success<InvestmentStatistics> | Err> {
  return await axios.get(`${BASE_URL}/single-investment-performance?start_date=2022-01-01&end_date=2022-09-29&instrument_id=${id}`).then(res => ({ data: res.data, err: null })).catch(err => ({ data: null, err }))
}

export default {
  breakdownAll,
  breakdownOne
}
