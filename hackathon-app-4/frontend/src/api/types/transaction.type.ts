export type TransactionId = { transaction_id: string }

export type TransactionPostData = {
  instrument_id: number,
  quantity: number,
  transaction_amount: number,
  transaction_type: 'BUY' | 'SELL',
  transaction_date: string
}

export type TransactionGetData = {
  transaction_id: number,
  instrument_id: number,
  quantity: number,
  transaction_date: string
  transaction_amount: number,
  transaction_type: 'BUY' | 'SELL',
  transaction_currency: string,
  is_cancelled: boolean
  created_at: string,
  modified_at: string
}