import { Success, Err, EmptyObj } from "../../utils";
import { InstrumentPostData, InstrumentId, InstrumentGetData, InstrumentPutData } from "../types/instrument.type";

const MOCK_DATA: InstrumentGetData[] = [{
  "instrument_id": '1',
  "instrument_name": "Armstrong - Jacobi",
  "instrument_type": "Private Equity",
  "sector": "Consumer Staples",
  "country": "US",
  "instrument_currency": "USD",
  "is_tradeable": true,
  "created_at": "2019-02-01 00:00:00",
  "modified_at": "2019-02-01 00:00:00",
  "notes": "Private Equity; Consumer Staples; Tradable Instrument"
},
{
  "instrument_id": '2',
  "instrument_name": "Armstrong - Reichert",
  "instrument_type": "Private Equity",
  "sector": "Information Technology",
  "country": "US",
  "instrument_currency": "USD",
  "is_tradeable": true,
  "created_at": "2019-02-01 00:00:00",
  "modified_at": "2019-02-01 00:00:00",
  "notes": "Private Equity; Information Technology; Tradable Instrument"
},
{
  "instrument_id": '3',
  "instrument_name": "Armstrong Sporer and Nikolaus",
  "instrument_type": "Private Equity",
  "sector": "Healthcare",
  "country": "US",
  "instrument_currency": "USD",
  "is_tradeable": true,
  "created_at": "2019-02-01 00:00:00",
  "modified_at": "2019-02-01 00:00:00",
  "notes": "Private Equity; Healthcare; Tradable Instrument"
},
{
  "instrument_id": '4',
  "instrument_name": "Auer - Bailey",
  "instrument_type": "Private Equity",
  "sector": "Industrials",
  "country": "US",
  "instrument_currency": "USD",
  "is_tradeable": true,
  "created_at": "2019-02-01 00:00:00",
  "modified_at": "2019-02-01 00:00:00",
  "notes": "Private Equity; Industrials; Tradable Instrument"
},
{
  "instrument_id": '5',
  "instrument_name": "Bailey - Rosenbaum",
  "instrument_type": "Private Equity",
  "sector": "Information Technology",
  "country": "US",
  "instrument_currency": "USD",
  "is_tradeable": true,
  "created_at": "2019-02-01 00:00:00",
  "modified_at": "2019-02-01 00:00:00",
  "notes": "Private Equity; Information Technology; Tradable Instrument"
},]

async function createInstrument(d: InstrumentPostData): Promise<Success<InstrumentId> | Err> {
  return {
    data: {
      instrument_id: '1'
    }, err: null
  }
}

async function getInstruments(): Promise<Success<InstrumentGetData[]> | Err> {
  return {
    data: MOCK_DATA, err: null
  }
}

async function getInstrumentById(id: string): Promise<Success<InstrumentGetData> | Err> {
  return {
    data: MOCK_DATA[0], err: null
  }
}

async function updateInstrument(id: string, d: InstrumentPutData): Promise<Success<EmptyObj> | Err> {
  return {
    data: {}, err: null
  }
}

async function deleteInstrument(id: string): Promise<Success<EmptyObj> | Err> {
  return {
    data: {}, err: null
  }
}

export default {
  createInstrument,
  getInstruments,
  getInstrumentById,
  updateInstrument,
  deleteInstrument
}