import { createContext } from 'react'
import { DIContainer } from './DIContainer'

/**
 * React context for DI container
 * Separated from component to comply with React Refresh rules
 */
export const DependencyContext = createContext<DIContainer | null>(null)
