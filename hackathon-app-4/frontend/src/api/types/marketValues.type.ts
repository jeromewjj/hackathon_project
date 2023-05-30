export type MarketValuesPostData = {
  value: number,
  date: string
}

export type MarketValuesGetData = {
  market_value_date: string,
  instrument_id: number,
  market_value: number,
  created_at: string,
  modified_at: string
}
