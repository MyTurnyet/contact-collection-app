import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { CheckInsPage } from '../CheckInsPage'
import { DependencyProvider } from '../../../di'
import { DIContainer } from '../../../di/DIContainer'

describe('CheckInsPage', () => {
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
    render(<CheckInsPage />, { wrapper })

    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Check-ins')).toBeInTheDocument()
    })
  })

  it('should display sections', async () => {
    render(<CheckInsPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Check-ins')).toBeInTheDocument()
    })

    expect(
      screen.getByRole('heading', { name: /overdue check-ins/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /upcoming check-ins/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /today's check-ins/i })
    ).toBeInTheDocument()
  })

  it('should display error state when storage fails', async () => {
    const proto = Object.getPrototypeOf(localStorage) as Storage
    const spy = vi.spyOn(proto, 'getItem').mockImplementation(() => {
      throw new Error('Storage error')
    })

    render(<CheckInsPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Storage error')).toBeInTheDocument()
    })

    spy.mockRestore()
  })
})
