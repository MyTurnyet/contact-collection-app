import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactFormModal } from '../ContactFormModal'
import { createContact } from '../../../domain/contact/Contact'
import { createContactId } from '../../../domain/contact/ContactId'
import { createPhoneNumber } from '../../../domain/contact/PhoneNumber'
import { createEmailAddress } from '../../../domain/contact/EmailAddress'
import { createLocation } from '../../../domain/contact/Location'
import { createCategoryId } from '../../../domain/category/CategoryId'

describe('ContactFormModal', () => {
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

  describe('create mode', () => {
    it('should display create title when no contact provided', () => {
      // When
      render(<ContactFormModal open onClose={vi.fn()} onSave={vi.fn()} />)

      // Then
      expect(screen.getByText(/create contact/i)).toBeInTheDocument()
    })

    it('should submit with valid data', async () => {
      // Given
      const user = userEvent.setup()
      const onSave = vi.fn()
      render(<ContactFormModal open onClose={vi.fn()} onSave={onSave} />)

      // When
      await user.type(screen.getByLabelText(/name/i), 'Jane Doe')
      await user.type(screen.getByLabelText(/phone/i), '+15559876543')
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com')
      await user.type(screen.getByLabelText(/city/i), 'Boston')
      await user.type(screen.getByLabelText(/country/i), 'USA')
      await user.click(screen.getByRole('button', { name: /save/i }))

      // Then
      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Jane Doe',
            phone: '+15559876543',
            email: 'jane@example.com',
            city: 'Boston',
            country: 'USA',
          })
        )
      })
    })

    it('should show validation error for invalid phone', async () => {
      // Given
      const user = userEvent.setup()
      render(<ContactFormModal open onClose={vi.fn()} onSave={vi.fn()} />)

      // When
      await user.type(screen.getByLabelText(/phone/i), 'invalid')
      await user.tab()

      // Then
      await waitFor(() => {
        expect(screen.getByText(/invalid phone/i)).toBeInTheDocument()
      })
    })

    it('should show validation error for invalid email', async () => {
      // Given
      const user = userEvent.setup()
      render(<ContactFormModal open onClose={vi.fn()} onSave={vi.fn()} />)

      // When
      await user.type(screen.getByLabelText(/email/i), 'invalid')
      await user.tab()

      // Then
      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
      })
    })
  })

  describe('edit mode', () => {
    it('should display edit title when contact provided', () => {
      // When
      render(
        <ContactFormModal
          open
          contact={mockContact}
          onClose={vi.fn()}
          onSave={vi.fn()}
        />
      )

      // Then
      expect(screen.getByText(/edit contact/i)).toBeInTheDocument()
    })

    it('should pre-fill form with contact data', () => {
      // When
      render(
        <ContactFormModal
          open
          contact={mockContact}
          onClose={vi.fn()}
          onSave={vi.fn()}
        />
      )

      // Then
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
      expect(screen.getByDisplayValue('+15551234567')).toBeInTheDocument()
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
    })
  })

  it('should close modal when cancel clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onClose = vi.fn()

    // When
    render(<ContactFormModal open onClose={onClose} onSave={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    // Then
    expect(onClose).toHaveBeenCalled()
  })
})
