import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateCheckInModal } from '../CreateCheckInModal'
import { createContact, createContactId, createImportantDateCollection } from '../../../domain/contact'
import { createCategoryId } from '../../../domain/category'

describe('CreateCheckInModal', () => {
  const mockContacts = [
    createContact({
      id: createContactId(),
      name: 'John Doe',
      categoryId: createCategoryId(),
      importantDates: createImportantDateCollection([]),
    }),
    createContact({
      id: createContactId(),
      name: 'Jane Smith',
      categoryId: createCategoryId(),
      importantDates: createImportantDateCollection([]),
    }),
  ]

  it('should display modal title', () => {
    // When
    render(
      <CreateCheckInModal
        open
        contacts={mockContacts}
        onClose={vi.fn()}
        onCreate={vi.fn()}
      />
    )

    // Then
    expect(screen.getByText(/create manual check-in/i)).toBeInTheDocument()
  })

  it('should display contact dropdown', () => {
    // When
    render(
      <CreateCheckInModal
        open
        contacts={mockContacts}
        onClose={vi.fn()}
        onCreate={vi.fn()}
      />
    )

    // Then
    expect(screen.getByLabelText(/contact/i)).toBeInTheDocument()
  })

  it('should display scheduled date field', () => {
    // When
    render(
      <CreateCheckInModal
        open
        contacts={mockContacts}
        onClose={vi.fn()}
        onCreate={vi.fn()}
      />
    )

    // Then
    expect(screen.getByLabelText(/scheduled date/i)).toBeInTheDocument()
  })

  it('should display notes field', () => {
    // When
    render(
      <CreateCheckInModal
        open
        contacts={mockContacts}
        onClose={vi.fn()}
        onCreate={vi.fn()}
      />
    )

    // Then
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument()
  })

  it('should require contact selection', async () => {
    // Given
    const user = userEvent.setup()
    const onCreate = vi.fn()

    // When
    render(
      <CreateCheckInModal
        open
        contacts={mockContacts}
        onClose={vi.fn()}
        onCreate={onCreate}
      />
    )

    await user.type(screen.getByLabelText(/scheduled date/i), '2026-03-15')
    await user.click(screen.getByRole('button', { name: /create/i }))

    // Then
    expect(onCreate).not.toHaveBeenCalled()
    expect(screen.getByText(/contact is required/i)).toBeInTheDocument()
  })

  it('should require scheduled date', async () => {
    // Given
    const user = userEvent.setup()
    const onCreate = vi.fn()

    // When
    render(
      <CreateCheckInModal
        open
        contacts={mockContacts}
        onClose={vi.fn()}
        onCreate={onCreate}
      />
    )

    await user.click(screen.getByLabelText(/contact/i))
    await user.click(screen.getByText('John Doe'))
    await user.click(screen.getByRole('button', { name: /create/i }))

    // Then
    expect(onCreate).not.toHaveBeenCalled()
    expect(screen.getByText(/scheduled date is required/i)).toBeInTheDocument()
  })

  it('should call onCreate with form data', async () => {
    // Given
    const user = userEvent.setup()
    const onCreate = vi.fn()

    // When
    render(
      <CreateCheckInModal
        open
        contacts={mockContacts}
        onClose={vi.fn()}
        onCreate={onCreate}
      />
    )

    await user.click(screen.getByLabelText(/contact/i))
    await user.click(screen.getByText('John Doe'))
    await user.type(screen.getByLabelText(/scheduled date/i), '2026-03-15')
    await user.type(screen.getByLabelText(/notes/i), 'Follow up discussion')
    await user.click(screen.getByRole('button', { name: /create/i }))

    // Then
    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith({
        contactId: mockContacts[0].id,
        scheduledDate: expect.any(Date),
        notes: 'Follow up discussion',
      })
    })
  })

  it('should call onCreate without notes when not provided', async () => {
    // Given
    const user = userEvent.setup()
    const onCreate = vi.fn()

    // When
    render(
      <CreateCheckInModal
        open
        contacts={mockContacts}
        onClose={vi.fn()}
        onCreate={onCreate}
      />
    )

    await user.click(screen.getByLabelText(/contact/i))
    await user.click(screen.getByText('Jane Smith'))
    await user.type(screen.getByLabelText(/scheduled date/i), '2026-04-01')
    await user.click(screen.getByRole('button', { name: /create/i }))

    // Then
    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith({
        contactId: mockContacts[1].id,
        scheduledDate: expect.any(Date),
        notes: undefined,
      })
    })
  })

  it('should call onClose when cancel clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onClose = vi.fn()

    // When
    render(
      <CreateCheckInModal
        open
        contacts={mockContacts}
        onClose={onClose}
        onCreate={vi.fn()}
      />
    )
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    // Then
    expect(onClose).toHaveBeenCalled()
  })

  it('should reset form when modal opens', () => {
    // Given
    const { rerender } = render(
      <CreateCheckInModal
        open={false}
        contacts={mockContacts}
        onClose={vi.fn()}
        onCreate={vi.fn()}
      />
    )

    // When
    rerender(
      <CreateCheckInModal
        open
        contacts={mockContacts}
        onClose={vi.fn()}
        onCreate={vi.fn()}
      />
    )

    // Then
    expect(screen.getByLabelText(/notes/i)).toHaveValue('')
  })

  it('should display loading state when saving', async () => {
    // Given
    const user = userEvent.setup()
    const onCreate = vi.fn(() => new Promise(() => {})) // Never resolves

    // When
    render(
      <CreateCheckInModal
        open
        contacts={mockContacts}
        onClose={vi.fn()}
        onCreate={onCreate}
      />
    )

    await user.click(screen.getByLabelText(/contact/i))
    await user.click(screen.getByText('John Doe'))
    await user.type(screen.getByLabelText(/scheduled date/i), '2026-03-15')
    await user.click(screen.getByRole('button', { name: /create/i }))

    // Then
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled()
    })
  })
})
