import { Success, Err, EmptyObj } from "../../utils";
import { InvestmentGetData } from "../types/investment.type";

const MOCK_DATA: InvestmentGetData[] = [{
  "instrument_id": 1,
  "refresh_datetime": "2019-02-01 00:00:00",
  cumulative_quantity: 20,
  cumulative_transaction_amount: 2000
},
{
  "instrument_id": 2,
  "refresh_datetime": "2019-02-01 00:00:00",
  cumulative_quantity: 20,
  cumulative_transaction_amount: 2000
},
{
  "instrument_id": 3,
  "refresh_datetime": "2019-02-01 00:00:00",
  cumulative_quantity: 20,
  cumulative_transaction_amount: 2000
}]

async function getAll(): Promise<Success<InvestmentGetData[]> | Err> {
  return {
    data: MOCK_DATA, err: null
  }
}

async function refresh(id: string): Promise<Success<EmptyObj> | Err> {
  return {
    data: {}, err: null
  }
}

export default {
  getAll,
  refresh
}