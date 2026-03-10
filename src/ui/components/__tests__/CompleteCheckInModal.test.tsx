import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CompleteCheckInModal } from '../CompleteCheckInModal'
import { createCheckIn } from '../../../domain/checkin/CheckIn'
import { createCheckInId } from '../../../domain/checkin/CheckInId'
import { createContactId } from '../../../domain/contact/ContactId'
import { createScheduledDate } from '../../../domain/checkin/ScheduledDate'
import { createCheckInFrequency } from '../../../domain/category/CheckInFrequency'

describe('CompleteCheckInModal', () => {
  const mockCheckIn = createCheckIn({
    id: createCheckInId(),
    contactId: createContactId(),
    scheduledDate: createScheduledDate(new Date('2026-02-15T12:00:00')),
  })

  const mockFrequency = createCheckInFrequency({ value: 1, unit: 'months' })
  const mockContactName = 'John Doe'

  it('should display modal title', () => {
    // When
    render(
      <CompleteCheckInModal
        open
        checkIn={mockCheckIn}
        contactName={mockContactName}
        onClose={vi.fn()}
        onComplete={vi.fn()}
      />
    )

    // Then
    expect(screen.getByText(/complete check-in/i)).toBeInTheDocument()
  })

  it('should display contact name', () => {
    // When
    render(
      <CompleteCheckInModal
        open
        checkIn={mockCheckIn}
        contactName={mockContactName}
        onClose={vi.fn()}
        onComplete={vi.fn()}
      />
    )

    // Then
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('should display scheduled date', () => {
    // When
    render(
      <CompleteCheckInModal
        open
        checkIn={mockCheckIn}
        contactName={mockContactName}
        onClose={vi.fn()}
        onComplete={vi.fn()}
      />
    )

    // Then
    expect(screen.getByText(/feb 15, 2026/i)).toBeInTheDocument()
  })

  it('should display notes textarea', () => {
    // When
    render(
      <CompleteCheckInModal
        open
        checkIn={mockCheckIn}
        contactName={mockContactName}
        onClose={vi.fn()}
        onComplete={vi.fn()}
      />
    )

    // Then
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument()
  })

  it('should display schedule next checkbox when frequency provided', () => {
    // When
    render(
      <CompleteCheckInModal
        open
        checkIn={mockCheckIn}
        contactName={mockContactName}
        frequency={mockFrequency}
        onClose={vi.fn()}
        onComplete={vi.fn()}
      />
    )

    // Then
    expect(screen.getByLabelText(/schedule next check-in/i)).toBeInTheDocument()
  })

  it('should display warning when no frequency provided', () => {
    // When
    render(
      <CompleteCheckInModal
        open
        checkIn={mockCheckIn}
        contactName={mockContactName}
        onClose={vi.fn()}
        onComplete={vi.fn()}
      />
    )

    // Then
    expect(screen.getByText(/no check-in frequency set/i)).toBeInTheDocument()
  })

  it('should call onComplete with check-in data and scheduleNext when complete clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onComplete = vi.fn()

    // When
    render(
      <CompleteCheckInModal
        open
        checkIn={mockCheckIn}
        contactName={mockContactName}
        frequency={mockFrequency}
        onClose={vi.fn()}
        onComplete={onComplete}
      />
    )
    await user.type(screen.getByLabelText(/notes/i), 'Had a great conversation')
    await user.click(screen.getByRole('button', { name: /complete/i }))

    // Then
    expect(onComplete).toHaveBeenCalledWith({
      checkInId: mockCheckIn.id,
      completionDate: expect.any(Date),
      notes: 'Had a great conversation',
      scheduleNext: true,
    })
  })

  it('should call onComplete with scheduleNext false when checkbox unchecked', async () => {
    // Given
    const user = userEvent.setup()
    const onComplete = vi.fn()

    // When
    render(
      <CompleteCheckInModal
        open
        checkIn={mockCheckIn}
        contactName={mockContactName}
        frequency={mockFrequency}
        onClose={vi.fn()}
        onComplete={onComplete}
      />
    )
    await user.click(screen.getByLabelText(/schedule next check-in/i))
    await user.click(screen.getByRole('button', { name: /complete/i }))

    // Then
    expect(onComplete).toHaveBeenCalledWith({
      checkInId: mockCheckIn.id,
      completionDate: expect.any(Date),
      notes: undefined,
      scheduleNext: false,
    })
  })

  it('should call onComplete without notes when notes are empty', async () => {
    // Given
    const user = userEvent.setup()
    const onComplete = vi.fn()

    // When
    render(
      <CompleteCheckInModal
        open
        checkIn={mockCheckIn}
        contactName={mockContactName}
        frequency={mockFrequency}
        onClose={vi.fn()}
        onComplete={onComplete}
      />
    )
    await user.click(screen.getByRole('button', { name: /complete/i }))

    // Then
    expect(onComplete).toHaveBeenCalledWith({
      checkInId: mockCheckIn.id,
      completionDate: expect.any(Date),
      notes: undefined,
      scheduleNext: true,
    })
  })

  it('should call onClose when cancel clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onClose = vi.fn()

    // When
    render(
      <CompleteCheckInModal
        open
        checkIn={mockCheckIn}
        contactName={mockContactName}
        onClose={onClose}
        onComplete={vi.fn()}
      />
    )
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    // Then
    expect(onClose).toHaveBeenCalled()
  })

  it('should reset notes when modal opens', () => {
    // Given
    const { rerender } = render(
      <CompleteCheckInModal
        open={false}
        checkIn={mockCheckIn}
        contactName={mockContactName}
        onClose={vi.fn()}
        onComplete={vi.fn()}
      />
    )

    // When
    rerender(
      <CompleteCheckInModal
        open
        checkIn={mockCheckIn}
        contactName={mockContactName}
        onClose={vi.fn()}
        onComplete={vi.fn()}
      />
    )

    // Then
    expect(screen.getByLabelText(/notes/i)).toHaveValue('')
  })
})
