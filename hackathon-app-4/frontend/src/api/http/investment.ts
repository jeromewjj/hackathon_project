import axios from "axios";
import ENV from "../../env";
import { Success, Err, EmptyObj } from "../../utils";
import { InvestmentGetData } from "../types/investment.type";

const BASE_URL = ENV.INVEST_API

async function getAll(instrumentId: number): Promise<Success<InvestmentGetData[]> | Err> {
  return await axios.get(`${BASE_URL}?instrument_id=${instrumentId}`).then(res => ({ data: res.data, err: null })).catch(err => ({ data: null, err }))
}

async function refresh(id: string): Promise<Success<EmptyObj> | Err> {
  return await axios.post(`${BASE_URL}/${id}`).then(res => ({ data: res.data, err: null })).catch(err => ({ data: null, err }))
}

export default {
  getAll,
  refresh
}