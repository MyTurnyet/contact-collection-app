import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { DashboardPage } from '../DashboardPage'
import { DependencyProvider } from '../../../di'
import { DIContainer } from '../../../di/DIContainer'

describe('DashboardPage', () => {
  let container: DIContainer

  beforeEach(() => {
    container = new DIContainer()
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DependencyProvider container={container}>{children}</DependencyProvider>
  )

  it('should display loading state initially', async () => {
    // When
    render(<DashboardPage />, { wrapper })

    // Then
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    // Wait for async effects to complete
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })

  it('should display dashboard title', async () => {
    // When
    render(<DashboardPage />, { wrapper })

    // Then
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })

  it('should display dashboard stats', async () => {
    // When
    render(<DashboardPage />, { wrapper })

    // Then
    await waitFor(() => {
      expect(screen.getByText('Overdue')).toBeInTheDocument()
    }, { timeout: 2000 })
    expect(screen.getByText('Upcoming')).toBeInTheDocument()
    expect(screen.getByText('Total Contacts')).toBeInTheDocument()
  })

  it('should display overdue check-ins section', async () => {
    // When
    render(<DashboardPage />, { wrapper })

    // Then
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
    expect(screen.getByRole('heading', { name: /overdue check-ins/i })).toBeInTheDocument()
  })

  it('should display upcoming check-ins section', async () => {
    // When
    render(<DashboardPage />, { wrapper })

    // Then
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
    expect(screen.getByRole('heading', { name: /upcoming check-ins/i })).toBeInTheDocument()
  })

  it('should display today check-ins section', async () => {
    // When
    render(<DashboardPage />, { wrapper })

    // Then
    await waitFor(() => {
      expect(screen.getByText(/today's check-ins/i)).toBeInTheDocument()
    })
  })
})
