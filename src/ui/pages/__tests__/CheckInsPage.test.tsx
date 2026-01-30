import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
    // When
    render(<CheckInsPage />, { wrapper })

    // Then
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create check-in/i })).toBeInTheDocument()
    })
  })

  it('should display empty state when no check-ins', async () => {
    // When
    render(<CheckInsPage />, { wrapper })

    // Then
    await waitFor(() => {
      expect(screen.getByText(/no check-ins yet/i)).toBeInTheDocument()
    })
  })

  it('should display create button', async () => {
    // When
    render(<CheckInsPage />, { wrapper })

    // Then
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create check-in/i })).toBeInTheDocument()
    })
  })

  it('should open create modal when create button clicked', async () => {
    // Given
    const user = userEvent.setup()
    render(<CheckInsPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create check-in/i })).toBeInTheDocument()
    })

    // When
    await user.click(screen.getByRole('button', { name: /create check-in/i }))

    // Then
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/create manual check-in/i)).toBeInTheDocument()
  })

  it('should display status filter', async () => {
    // When
    render(<CheckInsPage />, { wrapper })

    // Then
    await waitFor(() => {
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
    })
  })

  it('should display sort options', async () => {
    // When
    render(<CheckInsPage />, { wrapper })

    // Then
    await waitFor(() => {
      expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument()
    })
  })

  it('should create a check-in and display it in the list', async () => {
    // Given
    const user = userEvent.setup()

    // Create a contact first
    const createContact = container.getCreateContact()
    await createContact.execute({
      name: 'Test Contact',
      location: 'Test City',
      country: 'Test Country',
      timezone: 'UTC',
    })

    render(<CheckInsPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create check-in/i })).toBeInTheDocument()
    })

    // When - Open modal
    await user.click(screen.getByRole('button', { name: /create check-in/i }))

    // Fill in form
    await user.click(screen.getByLabelText(/contact/i))
    await user.click(screen.getByText('Test Contact'))
    await user.type(screen.getByLabelText(/scheduled date/i), '2026-03-15')
    await user.click(screen.getByRole('button', { name: /create/i }))

    // Then - Check-in appears in list
    await waitFor(() => {
      expect(screen.getByText('Test Contact')).toBeInTheDocument()
    })
  }, 15000)
})
