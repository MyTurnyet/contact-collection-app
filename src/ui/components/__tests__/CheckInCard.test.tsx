import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CheckInCard } from '../CheckInCard'
import { createCheckIn } from '../../../domain/checkin/CheckIn'
import { createCheckInId } from '../../../domain/checkin/CheckInId'
import { createContactId } from '../../../domain/contact/ContactId'
import { createScheduledDate } from '../../../domain/checkin/ScheduledDate'

describe('CheckInCard', () => {
  const mockCheckIn = createCheckIn({
    id: createCheckInId(),
    contactId: createContactId(),
    scheduledDate: createScheduledDate(new Date('2026-02-15T12:00:00')),
  })

  it('should display contact name', () => {
    // When
    render(<CheckInCard checkIn={mockCheckIn} contactName="John Doe" />)

    // Then
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('should display scheduled date', () => {
    // When
    render(<CheckInCard checkIn={mockCheckIn} contactName="John Doe" />)

    // Then
    expect(screen.getByText(/Feb 15, 2026/i)).toBeInTheDocument()
  })

  it('should display status badge for scheduled', () => {
    // When
    render(<CheckInCard checkIn={mockCheckIn} contactName="John Doe" />)

    // Then
    expect(screen.getByText(/^scheduled$/i)).toBeInTheDocument()
  })

  it('should display status badge for overdue', () => {
    // Given
    const overdueCheckIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2020-01-01')),
    })

    // When
    render(<CheckInCard checkIn={overdueCheckIn} contactName="Jane Doe" />)

    // Then
    expect(screen.getByText(/overdue/i)).toBeInTheDocument()
  })

  it('should call onComplete when complete button clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onComplete = vi.fn()

    // When
    render(
      <CheckInCard
        checkIn={mockCheckIn}
        contactName="John Doe"
        onComplete={onComplete}
      />
    )
    await user.click(screen.getByRole('button', { name: /complete/i }))

    // Then
    expect(onComplete).toHaveBeenCalledWith(mockCheckIn)
  })

  it('should call onReschedule when reschedule button clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onReschedule = vi.fn()

    // When
    render(
      <CheckInCard
        checkIn={mockCheckIn}
        contactName="John Doe"
        onReschedule={onReschedule}
      />
    )
    await user.click(screen.getByRole('button', { name: /reschedule/i }))

    // Then
    expect(onReschedule).toHaveBeenCalledWith(mockCheckIn)
  })

  it('should not show action buttons when handlers not provided', () => {
    // When
    render(<CheckInCard checkIn={mockCheckIn} contactName="John Doe" />)

    // Then
    expect(screen.queryByRole('button', { name: /complete/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /reschedule/i })).not.toBeInTheDocument()
  })
})
