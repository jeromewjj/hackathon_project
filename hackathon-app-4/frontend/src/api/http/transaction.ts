import { Success, Err, EmptyObj } from "../../utils";
import { InstrumentPostData, InstrumentId, InstrumentGetData, InstrumentPutData } from "../types/instrument.type";
import axios from 'axios'
import { TransactionPostData, TransactionGetData } from "../types/transaction.type";
import ENV from "../../env";

const BASE_URL = ENV.TX_API

async function createTransaction(
  d: TransactionPostData
): Promise<Success<EmptyObj> | Err> {
  return await axios.post(`${BASE_URL}`, d).then(res => ({ data: res.data, err: null })).catch((err) => ({ data: null, err }))
}

async function getTransactions(): Promise<Success<TransactionGetData[]> | Err> {
  return await axios.get(`${BASE_URL}`).then(res => ({ data: res.data, err: null })).catch((err) => ({ data: null, err }))
}

async function getTransactionById(
  id: number
): Promise<Success<TransactionGetData> | Err> {
  return await axios.get(`${BASE_URL}?transaction_id=${id}`).then(res => ({ data: res.data, err: null })).catch((err) => ({ data: null, err }))
}

async function cancelTransaction(id: number): Promise<Success<EmptyObj> | Err> {
  return await axios.delete(`${BASE_URL}?transaction_id=${id}`,).then(res => ({ data: res.data, err: null })).catch((err) => ({ data: null, err }))
}

export default {
  createTransaction,
  getTransactions,
  getTransactionById,
  cancelTransaction
}