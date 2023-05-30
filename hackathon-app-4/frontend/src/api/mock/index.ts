import { IApiService } from './../../context/IApiContext';
import instrument from './instrument';
import marketValues from './marketValues'
import transaction from './transaction';
import investment from './investment';
import analytics from './analytics';

export class MockApiService implements IApiService {
  analytics = {
    breakdownAll: analytics.breakdownAll,
    breakdownOne: analytics.breakdownOne
  };

  transaction = {
    createTransaction: transaction.createTransaction,
    getTransactions: transaction.getTransactions,
    getTransactionById: transaction.getTransactionById,
    cancelTransaction: transaction.cancelTransaction
  }

  marketValues = {
    uploadMarketValue: marketValues.uploadMarketValues,
    getMarketValuesById: marketValues.getMarketValues
  }

  instrument = {
    createInstrument: instrument.createInstrument,
    getInstruments: instrument.getInstruments,
    getInstrumentById: instrument.getInstrumentById,
    updateInstrument: instrument.updateInstrument,
    deleteInstrument: instrument.deleteInstrument
  }

  investment = {
    getAll: investment.getAll,
    refresh: investment.refresh
  };
}
