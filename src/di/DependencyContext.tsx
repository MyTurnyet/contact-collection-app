import { type ReactNode } from 'react'
import { DIContainer } from './DIContainer'
import { DependencyContext } from './DependencyContextObject'

// Create the DI container instance
const container = new DIContainer()

/**
 * Provider component that injects dependencies into the React tree
 */
interface DependencyProviderProps {
  children: ReactNode
  container?: DIContainer
}

export function DependencyProvider({
  children,
  container: customContainer,
}: DependencyProviderProps) {
  const activeContainer = customContainer ?? container
  return (
    <DependencyContext.Provider value={activeContainer}>
      {children}
    </DependencyContext.Provider>
  )
}
