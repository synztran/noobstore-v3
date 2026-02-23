import { createContext, useContext, ReactNode } from 'react'
import useRafflesPage, { UseRafflesPageReturn } from '@/hook/useRafflesPage'

const RafflesContext = createContext<UseRafflesPageReturn | null>(null)

export const RafflesProvider = ({ children }: { children: ReactNode }) => {
  const rafflesPage = useRafflesPage()
  return <RafflesContext.Provider value={rafflesPage}>{children}</RafflesContext.Provider>
}

export const useRafflesContext = (): UseRafflesPageReturn => {
  const context = useContext(RafflesContext)
  if (!context) {
    throw new Error('useRafflesContext must be used within a RafflesProvider')
  }
  return context
}
