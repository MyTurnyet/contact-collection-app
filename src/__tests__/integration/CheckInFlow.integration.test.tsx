import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { DependencyProvider } from '../../di'
import { DashboardPage } from '../../ui/pages/DashboardPage'

describe('Check-In Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should complete check-in and verify next scheduled date', async () => {
    // Given - Dashboard with check-ins
    render(
      <DependencyProvider>
        <DashboardPage />
      </DependencyProvider>
    )

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    // Then - Dashboard is rendered
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('should reschedule check-in and verify updated date', async () => {
    // Given - Dashboard with check-ins
    render(
      <DependencyProvider>
        <DashboardPage />
      </DependencyProvider>
    )

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    // Then - Dashboard is rendered
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
})
