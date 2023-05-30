import { BrowserRouter, Routes, Route, Router } from 'react-router-dom'
import '@fontsource/poppins/300.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/700.css'
import { lazy, Suspense } from 'react'
import Layout from './components/overall/Layout'
import TransactionPage from './pages/transactions/TransactionPage'
import Fallback from './components/overall/Fallback'
import AnalyticsPage from './pages/analytics/AnalyticsPage'
import InstrumentPage from './pages/instrument/InstrumentPage'
import MarketValuePage from './pages/marketValue/MarketValuePage'

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Fallback />}>
        <Routes>
          {/* Instrument */}
          <Route
            path='/instrument'
            element={
              <Layout>
                <InstrumentPage />
              </Layout>
            }
          />

          {/* Market Valuations */}
          <Route
            path='/market-valuation/:instrumentId'
            element={
              <Layout>
                <MarketValuePage />
              </Layout>
            }
          />

          {/* Transactions */}
          <Route
            path='/transaction'
            element={
              <Layout>
                <TransactionPage />
              </Layout>
            }
          />

          {/* Analytics */}
          <Route
            path='/analytics'
            element={
              <Layout>
                <AnalyticsPage />
              </Layout>
            }
          />

          {/* Fallthrough */}
          <Route
            path='/*'
            element={
              <Layout>
                <InstrumentPage />
              </Layout>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
