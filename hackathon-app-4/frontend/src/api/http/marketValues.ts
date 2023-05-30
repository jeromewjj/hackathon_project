import axios from 'axios';
import ENV from '../../env';
import { EmptyObj, Err, Success } from './../../utils';
import { MarketValuesPostData, MarketValuesGetData } from './../types/marketValues.type';

const BASE_URL = ENV.MV_API

async function uploadMarketValues(d: MarketValuesPostData[]): Promise<Success<EmptyObj> | Err> {
  return await axios.post(`${BASE_URL}`, d).then(res => ({ data: res.data, err: null })).catch(err => ({ data: null, err }))
}

async function getMarketValues(instrumentId: string | number): Promise<Success<MarketValuesGetData[]> | Err> {
  return await axios.get(`${BASE_URL}?instrument_id=${instrumentId}`).then(res => ({ data: res.data, err: null })).catch(err => ({ data: null, err }))
}

export default {
  uploadMarketValues,
  getMarketValues
}