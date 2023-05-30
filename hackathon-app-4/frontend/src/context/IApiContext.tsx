import { InvestmentStatistics } from '../api/types/analytics.type'
import {
  InstrumentGetData,
  InstrumentId,
  InstrumentPostData,
  InstrumentPutData
} from '../api/types/instrument.type'
import { InvestmentGetData } from '../api/types/investment.type'
import {
  MarketValuesGetData,
  MarketValuesPostData
} from '../api/types/marketValues.type'
import {
  TransactionGetData,
  TransactionPostData
} from '../api/types/transaction.type'
import { Success, Err, EmptyObj } from '../utils'

export interface IApiService {
  instrument: {
    createInstrument: (
      d: InstrumentPostData
    ) => Promise<Success<InstrumentId> | Err>

    getInstruments: () => Promise<Success<InstrumentGetData[]> | Err>

    getInstrumentById: (id: string) => Promise<Success<InstrumentGetData> | Err>

    updateInstrument: (
      id: string,
      d: InstrumentPutData
    ) => Promise<Success<EmptyObj> | Err>

    deleteInstrument: (id: string) => Promise<Success<EmptyObj> | Err>
  }

  marketValues: {
    uploadMarketValue: (
      d: MarketValuesPostData[]
    ) => Promise<Success<EmptyObj> | Err>

    getMarketValuesById: (
      id: number
    ) => Promise<Success<MarketValuesGetData[]> | Err>
  }

  transaction: {
    createTransaction: (
      d: TransactionPostData
    ) => Promise<Success<EmptyObj> | Err>

    getTransactions: () => Promise<Success<TransactionGetData[]> | Err>

    getTransactionById: (
      id: number
    ) => Promise<Success<TransactionGetData> | Err>

    cancelTransaction: (id: number) => Promise<Success<EmptyObj> | Err>
  }

  investment: {
    getAll: (
      instrumentId: number
    ) => Promise<Success<InvestmentGetData[]> | Err>

    refresh: (instrumentId: string) => Promise<Success<EmptyObj> | Err>
  }

  analytics: {
    breakdownAll: (date: Date) => Promise<Success<InvestmentStatistics[]> | Err>
    breakdownOne: (id: number) => Promise<Success<InvestmentStatistics> | Err>
  }
}
