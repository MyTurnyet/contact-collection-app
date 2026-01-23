import { useContext } from 'react'
import { DependencyContext } from './DependencyContextObject'
import { DIContainer } from './DIContainer'

/**
 * Hook to access the DI container from any component
 */
export function useDependencies(): DIContainer {
  const context = useContext(DependencyContext)
  if (!context) {
    throw new Error(
      'useDependencies must be used within a DependencyProvider'
    )
  }
  return context
}
