export type InstrumentId = { instrument_id: string }

export type InstrumentPostData = {
  instrument_name: string;
  instrument_type: string;
  sector: string;
  country: string;
  instrument_currency: string;
  is_tradeable: boolean;
  notes: string;
}

export type InstrumentGetData = InstrumentId & InstrumentPostData & {
  created_at: string;
  modified_at: string;
}

export type InstrumentPutData = {
  instrument_name: string,
  instrument_type: string,
  sector: string,
  country: string,
  instrument_currency: string,
  is_tradeable: boolean;
  notes: string
}
