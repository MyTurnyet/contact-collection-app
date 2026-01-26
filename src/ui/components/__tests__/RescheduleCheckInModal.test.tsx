import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RescheduleCheckInModal } from '../RescheduleCheckInModal'
import { createCheckIn } from '../../../domain/checkin/CheckIn'
import { createCheckInId } from '../../../domain/checkin/CheckInId'
import { createContactId } from '../../../domain/contact/ContactId'
import { createScheduledDate } from '../../../domain/checkin/ScheduledDate'

describe('RescheduleCheckInModal', () => {
  const mockCheckIn = createCheckIn({
    id: createCheckInId(),
    contactId: createContactId(),
    scheduledDate: createScheduledDate(new Date('2026-02-15T12:00:00')),
  })

  const mockContactName = 'John Doe'

  it('should display modal title', () => {
    // When
    render(
      <RescheduleCheckInModal
        open
        checkIn={mockCheckIn}
        contactName={mockContactName}
        onClose={vi.fn()}
        onReschedule={vi.fn()}
      />
    )

    // Then
    expect(screen.getByText(/reschedule check-in/i)).toBeInTheDocument()
  })

  it('should display contact name', () => {
    // When
    render(
      <RescheduleCheckInModal
        open
        checkIn={mockCheckIn}
        contactName={mockContactName}
        onClose={vi.fn()}
        onReschedule={vi.fn()}
      />
    )

    // Then
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('should display current scheduled date', () => {
    // When
    render(
      <RescheduleCheckInModal
        open
        checkIn={mockCheckIn}
        contactName={mockContactName}
        onClose={vi.fn()}
        onReschedule={vi.fn()}
      />
    )

    // Then
    expect(screen.getByText(/currently scheduled.*feb 15, 2026/i)).toBeInTheDocument()
  })

  it('should display new date picker', () => {
    // When
    render(
      <RescheduleCheckInModal
        open
        checkIn={mockCheckIn}
        contactName={mockContactName}
        onClose={vi.fn()}
        onReschedule={vi.fn()}
      />
    )

    // Then
    expect(screen.getByLabelText(/new date/i)).toBeInTheDocument()
  })

  it('should call onReschedule with new date when reschedule clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onReschedule = vi.fn()

    // When
    render(
      <RescheduleCheckInModal
        open
        checkIn={mockCheckIn}
        contactName={mockContactName}
        onClose={vi.fn()}
        onReschedule={onReschedule}
      />
    )
    const dateInput = screen.getByLabelText(/new date/i)
    await user.clear(dateInput)
    await user.type(dateInput, '2026-03-01')
    await user.click(screen.getByRole('button', { name: /reschedule/i }))

    // Then
    expect(onReschedule).toHaveBeenCalledWith({
      checkInId: mockCheckIn.id,
      newScheduledDate: expect.any(Date),
    })
  })

  it('should call onClose when cancel clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onClose = vi.fn()

    // When
    render(
      <RescheduleCheckInModal
        open
        checkIn={mockCheckIn}
        contactName={mockContactName}
        onClose={onClose}
        onReschedule={vi.fn()}
      />
    )
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    // Then
    expect(onClose).toHaveBeenCalled()
  })

  it('should show validation error when date is empty', async () => {
    // Given
    const user = userEvent.setup()
    const onReschedule = vi.fn()

    // When
    render(
      <RescheduleCheckInModal
        open
        checkIn={mockCheckIn}
        contactName={mockContactName}
        onClose={vi.fn()}
        onReschedule={onReschedule}
      />
    )
    const dateInput = screen.getByLabelText(/new date/i)
    await user.clear(dateInput)
    await user.click(screen.getByRole('button', { name: /reschedule/i }))

    // Then
    expect(screen.getByText(/new date is required/i)).toBeInTheDocument()
    expect(onReschedule).not.toHaveBeenCalled()
  })

  it('should reset form when modal opens', () => {
    // Given
    const { rerender } = render(
      <RescheduleCheckInModal
        open={false}
        checkIn={mockCheckIn}
        contactName={mockContactName}
        onClose={vi.fn()}
        onReschedule={vi.fn()}
      />
    )

    // When
    rerender(
      <RescheduleCheckInModal
        open
        checkIn={mockCheckIn}
        contactName={mockContactName}
        onClose={vi.fn()}
        onReschedule={vi.fn()}
      />
    )

    // Then
    expect(screen.getByLabelText(/new date/i)).toHaveValue('')
  })
})
