console.log(import.meta.env)
const ENV = {
  NODE_ENV: import.meta.env.MODE as ('development' | 'production'),
  API_MODE: import.meta.env.VITE_API_MODE ?? 'real' as ('real' | 'mock'),
  INSTRU_API: `${import.meta.env.VITE_INSTRU_API}/instruments`,
  INVEST_API: `${import.meta.env.VITE_INVEST_API}/investments`,
  TX_API: `${import.meta.env.VITE_TX_API}/transactions`,
  MV_API: `${import.meta.env.VITE_MV_API}/market-values`,
  ANALYTICS_API: import.meta.env.VITE_ANALYTICS_API,

}

export default ENV