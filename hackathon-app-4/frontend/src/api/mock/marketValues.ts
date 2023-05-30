import axios from 'axios';
import { EmptyObj, Err, Success } from './../../utils';
import { MarketValuesPostData, MarketValuesGetData } from './../types/marketValues.type';

const BASE_URL = 'http://localhost:8081'

const MOCK_DATA: MarketValuesGetData[] = [{
  "instrument_id": 152,
  "market_value_date": "2020-01-31 00:00:00.0000000",
  "market_value": 100000000,
  "created_at": "2020-01-31 00:00:00",
  "modified_at": "2020-01-31 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2020-02-29 00:00:00.0000000",
  "market_value": 100000000,
  "created_at": "2020-02-29 00:00:00",
  "modified_at": "2020-02-29 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2020-03-31 00:00:00.0000000",
  "market_value": 100000000,
  "created_at": "2020-03-31 00:00:00",
  "modified_at": "2020-03-31 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2020-04-30 00:00:00.0000000",
  "market_value": 100000000,
  "created_at": "2020-04-30 00:00:00",
  "modified_at": "2020-04-30 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2020-05-31 00:00:00.0000000",
  "market_value": 100000000,
  "created_at": "2020-05-31 00:00:00",
  "modified_at": "2020-05-31 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2020-06-30 00:00:00.0000000",
  "market_value": 100000000,
  "created_at": "2020-06-30 00:00:00",
  "modified_at": "2020-06-30 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2020-07-31 00:00:00.0000000",
  "market_value": 100000000,
  "created_at": "2020-07-31 00:00:00",
  "modified_at": "2020-07-31 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2020-08-31 00:00:00.0000000",
  "market_value": 100000000,
  "created_at": "2020-08-31 00:00:00",
  "modified_at": "2020-08-31 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2020-09-30 00:00:00.0000000",
  "market_value": 120000000,
  "created_at": "2020-09-30 00:00:00",
  "modified_at": "2020-09-30 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2020-10-31 00:00:00.0000000",
  "market_value": 120000000,
  "created_at": "2020-10-31 00:00:00",
  "modified_at": "2020-10-31 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2020-11-30 00:00:00.0000000",
  "market_value": 120000000,
  "created_at": "2020-11-30 00:00:00",
  "modified_at": "2020-11-30 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2020-12-31 00:00:00.0000000",
  "market_value": 147615415.42,
  "created_at": "2020-12-31 00:00:00",
  "modified_at": "2020-12-31 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2021-01-31 00:00:00.0000000",
  "market_value": 147615415.42,
  "created_at": "2021-01-31 00:00:00",
  "modified_at": "2021-01-31 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2021-02-28 00:00:00.0000000",
  "market_value": 147615415.42,
  "created_at": "2021-02-28 00:00:00",
  "modified_at": "2021-02-28 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2021-03-31 00:00:00.0000000",
  "market_value": 175948309.76,
  "created_at": "2021-03-31 00:00:00",
  "modified_at": "2021-03-31 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2021-04-30 00:00:00.0000000",
  "market_value": 175948309.76,
  "created_at": "2021-04-30 00:00:00",
  "modified_at": "2021-04-30 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2021-05-31 00:00:00.0000000",
  "market_value": 175948309.76,
  "created_at": "2021-05-31 00:00:00",
  "modified_at": "2021-05-31 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2021-06-30 00:00:00.0000000",
  "market_value": 175948309.76,
  "created_at": "2021-06-30 00:00:00",
  "modified_at": "2021-06-30 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2021-07-31 00:00:00.0000000",
  "market_value": 175948309.76,
  "created_at": "2021-07-31 00:00:00",
  "modified_at": "2021-07-31 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2021-08-31 00:00:00.0000000",
  "market_value": 175948309.76,
  "created_at": "2021-08-31 00:00:00",
  "modified_at": "2021-08-31 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2021-09-30 00:00:00.0000000",
  "market_value": 175948309.76,
  "created_at": "2021-09-30 00:00:00",
  "modified_at": "2021-09-30 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2021-10-31 00:00:00.0000000",
  "market_value": 175948309.76,
  "created_at": "2021-10-31 00:00:00",
  "modified_at": "2021-10-31 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2021-11-30 00:00:00.0000000",
  "market_value": 175948309.76,
  "created_at": "2021-11-30 00:00:00",
  "modified_at": "2021-11-30 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2021-12-31 00:00:00.0000000",
  "market_value": 175948309.76,
  "created_at": "2021-12-31 00:00:00",
  "modified_at": "2021-12-31 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2022-01-31 00:00:00.0000000",
  "market_value": 190654650.04,
  "created_at": "2022-01-31 00:00:00",
  "modified_at": "2022-01-31 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2022-02-28 00:00:00.0000000",
  "market_value": 190654650.04,
  "created_at": "2022-02-28 00:00:00",
  "modified_at": "2022-02-28 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2022-03-31 00:00:00.0000000",
  "market_value": 175195760.11,
  "created_at": "2022-03-31 00:00:00",
  "modified_at": "2022-03-31 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2022-04-30 00:00:00.0000000",
  "market_value": 175195760.11,
  "created_at": "2022-04-30 00:00:00",
  "modified_at": "2022-04-30 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2022-05-31 00:00:00.0000000",
  "market_value": 175195760.11,
  "created_at": "2022-05-31 00:00:00",
  "modified_at": "2022-05-31 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2022-06-30 00:00:00.0000000",
  "market_value": 175195760.11,
  "created_at": "2022-06-30 00:00:00",
  "modified_at": "2022-06-30 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2022-07-31 00:00:00.0000000",
  "market_value": 175195760.11,
  "created_at": "2022-07-31 00:00:00",
  "modified_at": "2022-07-31 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2022-08-31 00:00:00.0000000",
  "market_value": 158277577.49,
  "created_at": "2022-08-31 00:00:00",
  "modified_at": "2022-08-31 00:00:00"
},
{
  "instrument_id": 152,
  "market_value_date": "2022-09-30 00:00:00.0000000",
  "market_value": 158277577.49,
  "created_at": "2022-09-30 00:00:00",
  "modified_at": "2022-09-30 00:00:00"
}]

async function uploadMarketValues(d: MarketValuesPostData[]): Promise<Success<EmptyObj> | Err> {
  return {
    data: {}, err: null
  }
}

async function getMarketValues(): Promise<Success<MarketValuesGetData[]> | Err> {
  return {
    data: MOCK_DATA, err: null
  }
}

export default {
  uploadMarketValues,
  getMarketValues
}