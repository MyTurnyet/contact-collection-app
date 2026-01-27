import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DashboardPage } from '../DashboardPage'
import { DependencyProvider } from '../../../di'
import { DIContainer } from '../../../di/DIContainer'
import { createCheckIn, createCheckInId, createScheduledDate } from '../../../domain/checkin'

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

  it('should allow dismissing the notification permission prompt', async () => {
    const user = userEvent.setup()
    const originalNotification = (globalThis as unknown as { Notification?: unknown }).Notification

    class FakeNotification {
      static permission = 'default' as const
      static requestPermission() {
        return Promise.resolve('default' as const)
      }
    }

    ;(globalThis as unknown as { Notification?: unknown }).Notification =
      FakeNotification as unknown

    try {
      render(<DashboardPage />, { wrapper })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /later/i })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /later/i }))

      await waitFor(() => {
        expect(screen.queryByText(/enable notifications/i)).not.toBeInTheDocument()
      })
    } finally {
      ;(globalThis as unknown as { Notification?: unknown }).Notification = originalNotification
    }
  })

  it('should send notification when overdue check-ins exist and permission granted', async () => {
    const created: string[] = []
    const originalNotification = (globalThis as unknown as { Notification?: unknown }).Notification

    class FakeNotification {
      static permission = 'granted' as const
      constructor(title: string) {
        created.push(title)
      }
      static requestPermission() {
        return Promise.resolve('granted' as const)
      }
    }

    ;(globalThis as unknown as { Notification?: unknown }).Notification =
      FakeNotification as unknown

    try {
      const createContact = container.getCreateContact()

      const contact = await createContact.execute({
        name: 'John Doe',
        phone: '+15551234567',
        email: 'john@example.com',
        location: 'New York',
        country: 'USA',
        timezone: 'America/New_York',
      })

      const overdueDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const overdueCheckIn = createCheckIn({
        id: createCheckInId(),
        contactId: contact.id,
        scheduledDate: createScheduledDate(overdueDate),
      })
      localStorage.setItem('checkins', JSON.stringify([overdueCheckIn]))

      render(<DashboardPage />, { wrapper })

      await waitFor(() => {
        expect(created.includes('Overdue Check-ins')).toBe(true)
      })
    } finally {
      ;(globalThis as unknown as { Notification?: unknown }).Notification = originalNotification
    }
  })

  it('should display error state when storage fails', async () => {
    const proto = Object.getPrototypeOf(localStorage) as Storage
    const spy = vi.spyOn(proto, 'getItem').mockImplementation(() => {
      throw new Error('Storage error')
    })

    render(<DashboardPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Storage error')).toBeInTheDocument()
    })

    spy.mockRestore()
  })
})
