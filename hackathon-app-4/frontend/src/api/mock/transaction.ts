import { Success, Err, EmptyObj } from "../../utils";
import { InstrumentPostData, InstrumentId, InstrumentGetData, InstrumentPutData } from "../types/instrument.type";
import axios from 'axios'
import { TransactionPostData, TransactionGetData } from "../types/transaction.type";

const MOCK_DATA: TransactionGetData[] = [{
  "transaction_id": 1,
  "instrument_id": 1,
  "transaction_amount": -566120.5200,
  "transaction_currency": "USD",
  "transaction_date": "2020-09-04",
  "quantity": 20,
  "is_cancelled": false,
  "created_at": "2020-09-04 00:00:00",
  "modified_at": "2020-09-04 00:00:00",
  "transaction_type": "BUY"
},
{
  "transaction_id": 2,
  "instrument_id": 1,
  "transaction_amount": -447919.5300,
  "transaction_currency": "USD",
  "transaction_date": "2020-10-04",
  "quantity": 16,
  "is_cancelled": false,
  "created_at": "2020-10-04 00:00:00",
  "modified_at": "2020-10-04 00:00:00",
  "transaction_type": "BUY"
},
{
  "transaction_id": 3,
  "instrument_id": 1,
  "transaction_amount": -1017150.6100,
  "transaction_currency": "USD",
  "transaction_date": "2020-11-17",
  "quantity": 30,
  "is_cancelled": false,
  "created_at": "2020-11-17 00:00:00",
  "modified_at": "2020-11-17 00:00:00",
  "transaction_type": "SELL"
}]

async function createTransaction(
  d: TransactionPostData
): Promise<Success<EmptyObj> | Err> {
  return {
    data: {},
    err: null
  }
}

async function getTransactions(): Promise<Success<TransactionGetData[]> | Err> {
  return {
    data: MOCK_DATA,
    err: null
  }
}

async function getTransactionById(
  id: number
): Promise<Success<TransactionGetData> | Err> {
  return {
    data: MOCK_DATA[0],
    err: null
  }
}

async function cancelTransaction(id: number): Promise<Success<EmptyObj> | Err> {
  return {
    data: {},
    err: null
  }
}

export default {
  createTransaction,
  getTransactions,
  getTransactionById,
  cancelTransaction
}