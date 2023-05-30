import { ThemeProvider } from '@mui/material'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ApiServiceContextProvider from './context/ApiContext'
import THEME from './context/MuiContext'
import ENV from './env'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ApiServiceContextProvider svcType={ENV.API_MODE}>
      <ThemeProvider theme={THEME}>
        <App />
      </ThemeProvider>
    </ApiServiceContextProvider>
  </React.StrictMode>
)
