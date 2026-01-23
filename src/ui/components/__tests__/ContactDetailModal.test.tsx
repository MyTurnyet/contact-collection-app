import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactDetailModal } from '../ContactDetailModal'
import { createContact } from '../../../domain/contact/Contact'
import { createContactId } from '../../../domain/contact/ContactId'
import { createPhoneNumber } from '../../../domain/contact/PhoneNumber'
import { createEmailAddress } from '../../../domain/contact/EmailAddress'
import { createLocation } from '../../../domain/contact/Location'
import { createCategoryId } from '../../../domain/category/CategoryId'
import { createRelationshipContext } from '../../../domain/contact/RelationshipContext'

describe('ContactDetailModal', () => {
  const mockContact = createContact({
    id: createContactId(),
    name: 'John Doe',
    phone: createPhoneNumber('+15551234567'),
    email: createEmailAddress('john@example.com'),
    location: createLocation({
      city: 'New York',
      state: 'NY',
      country: 'USA',
      timezone: 'America/New_York',
    }),
    categoryId: createCategoryId(),
    relationshipContext: createRelationshipContext('Friend from college'),
  })

  it('should display contact name', () => {
    // When
    render(<ContactDetailModal open contact={mockContact} onClose={vi.fn()} />)

    // Then
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('should display phone number', () => {
    // When
    render(<ContactDetailModal open contact={mockContact} onClose={vi.fn()} />)

    // Then
    expect(screen.getByText('+15551234567')).toBeInTheDocument()
  })

  it('should display email address', () => {
    // When
    render(<ContactDetailModal open contact={mockContact} onClose={vi.fn()} />)

    // Then
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('should display full location', () => {
    // When
    render(<ContactDetailModal open contact={mockContact} onClose={vi.fn()} />)

    // Then
    expect(screen.getByText(/New York, NY, USA/)).toBeInTheDocument()
  })

  it('should display timezone', () => {
    // When
    render(<ContactDetailModal open contact={mockContact} onClose={vi.fn()} />)

    // Then
    expect(screen.getByText(/America\/New_York/)).toBeInTheDocument()
  })

  it('should display relationship context', () => {
    // When
    render(<ContactDetailModal open contact={mockContact} onClose={vi.fn()} />)

    // Then
    expect(screen.getByText('Friend from college')).toBeInTheDocument()
  })

  it('should close when close button clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onClose = vi.fn()

    // When
    render(<ContactDetailModal open contact={mockContact} onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: /close/i }))

    // Then
    expect(onClose).toHaveBeenCalled()
  })

  it('should call onEdit when edit button clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onEdit = vi.fn()

    // When
    render(
      <ContactDetailModal
        open
        contact={mockContact}
        onClose={vi.fn()}
        onEdit={onEdit}
      />
    )
    await user.click(screen.getByRole('button', { name: /edit/i }))

    // Then
    expect(onEdit).toHaveBeenCalledWith(mockContact)
  })
})
