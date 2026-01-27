import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactListPage } from '../ContactListPage'
import { DependencyProvider } from '../../../di'
import { DIContainer } from '../../../di/DIContainer'

describe('ContactListPage', () => {
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

  it('should display loading state initially', () => {
    // When
    render(<ContactListPage />, { wrapper })

    // Then
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should display empty state when no contacts', async () => {
    // When
    render(<ContactListPage />, { wrapper })

    // Then
    await waitFor(() => {
      expect(screen.getByText(/no contacts yet/i)).toBeInTheDocument()
    })
  })

  it('should display create button', async () => {
    // When
    render(<ContactListPage />, { wrapper })

    // Then
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create contact/i })).toBeInTheDocument()
    })
  })

  it('should display search bar', async () => {
    // When
    render(<ContactListPage />, { wrapper })

    // Then
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search contacts/i)).toBeInTheDocument()
    })
  })

  it('should open create modal when create button clicked', async () => {
    // Given
    const user = userEvent.setup()
    render(<ContactListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create contact/i })).toBeInTheDocument()
    })

    // When
    await user.click(screen.getByRole('button', { name: /create contact/i }))

    // Then
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should display contacts after creation', async () => {
    // Given
    const user = userEvent.setup()
    render(<ContactListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create contact/i })).toBeInTheDocument()
    })

    // When - Create a contact
    await user.click(screen.getByRole('button', { name: /create contact/i }))
    await user.type(screen.getByLabelText(/^name/i), 'John Doe')
    await user.type(screen.getByLabelText(/phone/i), '+15551234567')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/city/i), 'New York')
    await user.type(screen.getByLabelText(/country/i), 'USA')
    await user.click(screen.getByRole('button', { name: /save/i }))

    // Then
    await waitFor(
      () => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      },
      { timeout: 10000 }
    )
  })

  it('should have search functionality', async () => {
    // Given
    const user = userEvent.setup()
    render(<ContactListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create contact/i })).toBeInTheDocument()
    })

    // When - Type in search
    await user.type(screen.getByPlaceholderText(/search contacts/i), 'test')

    // Then - search bar accepts input
    expect(screen.getByDisplayValue('test')).toBeInTheDocument()
  })
})
