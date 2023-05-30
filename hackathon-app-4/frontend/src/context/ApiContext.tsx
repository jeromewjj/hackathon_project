import { createContext, ReactNode, useContext, useRef } from 'react'
import { ApiService } from '../api/http'
import { MockApiService } from '../api/mock'
import { IApiService } from './IApiContext'

type ServiceType = 'real' | 'mock'

function getApiService(type: ServiceType): IApiService {
  return new ApiService()
}

const ApiContext = createContext<IApiService | null>(null)

const ApiContextProvider = (props: {
  svcType?: ServiceType
  children: ReactNode
}) => {
  const apiService = getApiService(props.svcType ?? 'real')

  return <ApiContext.Provider value={apiService} children={props.children} />
}

export default ApiContextProvider

/* Hook for components to interact with the API. */
export function useApiSvc(): IApiService {
  const ctx = useContext(ApiContext)

  if (!ctx) {
    throw new Error('useApiSvc must be used in a ApiContextProvider')
  }

  return ctx
}
