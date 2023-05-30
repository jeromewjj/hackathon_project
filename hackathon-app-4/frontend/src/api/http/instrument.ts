import { Success, Err, EmptyObj } from "../../utils";
import { InstrumentPostData, InstrumentId, InstrumentGetData, InstrumentPutData } from "../types/instrument.type";
import axios from 'axios'
import ENV from "../../env";

const BASE_URL = ENV.INSTRU_API

async function createInstrument(d: InstrumentPostData): Promise<Success<InstrumentId> | Err> {
  return await axios.post(`${BASE_URL}`, d).then(res => ({ data: res.data, err: null })).catch(err => ({ data: null, err }))
}

async function getInstruments(): Promise<Success<InstrumentGetData[]> | Err> {
  return await axios.get(`${BASE_URL}`).then(res => ({ data: res.data, err: null })).catch(err => ({ data: null, err }))
}

async function getInstrumentById(id: string): Promise<Success<InstrumentGetData> | Err> {
  return await axios.get(`${BASE_URL}/${id}`).then(res => ({ data: res.data, err: null })).catch(err => ({ data: null, err }))
}

async function updateInstrument(id: string, d: InstrumentPutData): Promise<Success<EmptyObj> | Err> {
  return await axios.put(`${BASE_URL}?instrument_id=${id}`, d).then(res => ({ data: res.data, err: null })).catch(err => ({ data: null, err }))
}

async function deleteInstrument(id: string): Promise<Success<EmptyObj> | Err> {
  return await axios.delete(`${BASE_URL}?instrument_id=${id}`).then(res => ({ data: res.data, err: null })).catch(err => ({ data: null, err }))
}

export default {
  createInstrument,
  getInstruments,
  getInstrumentById,
  updateInstrument,
  deleteInstrument
}