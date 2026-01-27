import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
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

  it('should display loading state initially', async () => {
    // When
    render(<ContactListPage />, { wrapper })

    // Then
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create contact/i })).toBeInTheDocument()
    })
  })

  it('should display empty state when no contacts', async () => {
    // When
    render(<ContactListPage />, { wrapper })

    // Then
    await waitFor(() => {
      expect(screen.getByText(/no contacts yet/i)).toBeInTheDocument()
    })
  }, 15000)

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

  it('should close create modal when cancel clicked', async () => {
    const user = userEvent.setup()
    render(<ContactListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create contact/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /create contact/i }))
    const dialog = screen.getByRole('dialog', { name: /create contact/i })
    expect(dialog).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: /cancel/i }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /create contact/i })).not.toBeInTheDocument()
    })
  }, 15000)

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
  }, 15000)

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

  it('should display error state when storage fails', async () => {
    const proto = Object.getPrototypeOf(localStorage) as Storage
    const spy = vi.spyOn(proto, 'getItem').mockImplementation(() => {
      throw new Error('Storage error')
    })

    render(<ContactListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Storage error')).toBeInTheDocument()
    })

    spy.mockRestore()
  })

  it('should delete a contact from the list', async () => {
    const user = userEvent.setup()
    render(<ContactListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create contact/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /create contact/i }))
    await user.type(screen.getByLabelText(/^name/i), 'John Doe')
    await user.type(screen.getByLabelText(/phone/i), '+15551234567')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/city/i), 'New York')
    await user.type(screen.getByLabelText(/country/i), 'USA')
    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    await user.click(screen.getByLabelText('delete'))

    await waitFor(() => {
      expect(screen.getByText(/no contacts yet/i)).toBeInTheDocument()
    })
  }, 15000)

  it('should allow viewing a contact and switching to edit', async () => {
    const user = userEvent.setup()
    render(<ContactListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create contact/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /create contact/i }))
    await user.type(screen.getByLabelText(/^name/i), 'John Doe')
    await user.type(screen.getByLabelText(/phone/i), '+15551234567')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/city/i), 'New York')
    await user.type(screen.getByLabelText(/country/i), 'USA')
    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    await user.click(screen.getByText('John Doe'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^edit$/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  }, 15000)

  it('should close contact detail modal when close clicked', async () => {
    const user = userEvent.setup()
    render(<ContactListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create contact/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /create contact/i }))
    await user.type(screen.getByLabelText(/^name/i), 'John Doe')
    await user.type(screen.getByLabelText(/phone/i), '+15551234567')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/city/i), 'New York')
    await user.type(screen.getByLabelText(/country/i), 'USA')
    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    await user.click(screen.getByText('John Doe'))
    const dialog = screen.getByRole('dialog', { name: /john doe/i })
    expect(dialog).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: /^close$/i }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  }, 15000)

  it('should update contact when editing and saving', async () => {
    const user = userEvent.setup()
    render(<ContactListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create contact/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /create contact/i }))
    await user.type(screen.getByLabelText(/^name/i), 'John Doe')
    await user.type(screen.getByLabelText(/phone/i), '+15551234567')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/city/i), 'New York')
    await user.type(screen.getByLabelText(/country/i), 'USA')
    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    await user.click(screen.getByLabelText('edit'))
    const dialog = screen.getByRole('dialog', { name: /edit contact/i })
    expect(dialog).toBeInTheDocument()

    const name = within(dialog).getByLabelText(/^name/i)
    await user.clear(name)
    await user.type(name, 'Jane Doe')
    await user.click(within(dialog).getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    })
  }, 15000)

  it('should filter contacts by email and phone', async () => {
    const user = userEvent.setup()
    render(<ContactListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create contact/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /create contact/i }))
    await user.type(screen.getByLabelText(/^name/i), 'John Doe')
    await user.type(screen.getByLabelText(/phone/i), '+15551234567')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/city/i), 'New York')
    await user.type(screen.getByLabelText(/country/i), 'USA')
    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    await user.clear(screen.getByPlaceholderText(/search contacts/i))
    await user.type(screen.getByPlaceholderText(/search contacts/i), 'john@')

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    await user.clear(screen.getByPlaceholderText(/search contacts/i))
    await user.type(screen.getByPlaceholderText(/search contacts/i), '555')

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  }, 15000)
})
