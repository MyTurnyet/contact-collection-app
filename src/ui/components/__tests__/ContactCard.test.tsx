import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactCard } from '../ContactCard'
import { createContact } from '../../../domain/contact/Contact'
import { createContactId } from '../../../domain/contact/ContactId'
import { createPhoneNumber } from '../../../domain/contact/PhoneNumber'
import { createEmailAddress } from '../../../domain/contact/EmailAddress'
import { createLocation } from '../../../domain/contact/Location'
import { createCategoryId } from '../../../domain/category/CategoryId'

describe('ContactCard', () => {
  const mockContact = createContact({
    id: createContactId(),
    name: 'John Doe',
    phone: createPhoneNumber('+15551234567'),
    email: createEmailAddress('john@example.com'),
    location: createLocation({
      city: 'New York',
      country: 'USA',
      timezone: 'America/New_York',
    }),
    categoryId: createCategoryId(),
  })

  it('should display contact name', () => {
    // When
    render(<ContactCard contact={mockContact} />)

    // Then
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('should display phone number', () => {
    // When
    render(<ContactCard contact={mockContact} />)

    // Then
    expect(screen.getByText('+15551234567')).toBeInTheDocument()
  })

  it('should display email address', () => {
    // When
    render(<ContactCard contact={mockContact} />)

    // Then
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('should display location', () => {
    // When
    render(<ContactCard contact={mockContact} />)

    // Then
    expect(screen.getByText(/New York, USA/)).toBeInTheDocument()
  })

  it('should call onEdit when edit button clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onEdit = vi.fn()

    // When
    render(<ContactCard contact={mockContact} onEdit={onEdit} />)
    await user.click(screen.getByRole('button', { name: /edit/i }))

    // Then
    expect(onEdit).toHaveBeenCalledWith(mockContact)
  })

  it('should call onDelete when delete button clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onDelete = vi.fn()

    // When
    render(<ContactCard contact={mockContact} onDelete={onDelete} />)
    await user.click(screen.getByRole('button', { name: /delete/i }))

    // Then
    expect(onDelete).toHaveBeenCalledWith(mockContact.id)
  })

  it('should call onView when card clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onView = vi.fn()

    // When
    render(<ContactCard contact={mockContact} onView={onView} />)
    await user.click(screen.getByTestId('contact-card'))

    // Then
    expect(onView).toHaveBeenCalledWith(mockContact)
  })
})
