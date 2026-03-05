import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { addDays } from 'date-fns'
import { CheckInCard } from '../CheckInCard'
import { createCheckIn } from '../../../domain/checkin/CheckIn'
import { createCheckInId } from '../../../domain/checkin/CheckInId'
import { createContactId } from '../../../domain/contact/ContactId'
import { createScheduledDate } from '../../../domain/checkin/ScheduledDate'
import { createCompletionDate } from '../../../domain/checkin/CompletionDate'

const FUTURE_DATE = addDays(new Date(), 30)
const PAST_DATE = new Date('2020-01-01')

describe('CheckInCard', () => {
  const mockCheckIn = createCheckIn({
    id: createCheckInId(),
    contactId: createContactId(),
    scheduledDate: createScheduledDate(FUTURE_DATE),
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

    // Then — match any date text (the exact format is locale-dependent)
    expect(screen.getByText(/scheduled:/i)).toBeInTheDocument()
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
      scheduledDate: createScheduledDate(PAST_DATE),
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

  it('should not show complete button for completed check-ins', () => {
    // Given
    const completedCheckIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2026-02-15')),
      completionDate: createCompletionDate(new Date('2026-02-15')),
    })
    const onComplete = vi.fn()

    // When
    render(
      <CheckInCard
        checkIn={completedCheckIn}
        contactName="John Doe"
        onComplete={onComplete}
      />
    )

    // Then
    expect(screen.queryByRole('button', { name: /complete/i })).not.toBeInTheDocument()
  })

  it('should not show reschedule button for completed check-ins', () => {
    // Given
    const completedCheckIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2026-02-15')),
      completionDate: createCompletionDate(new Date('2026-02-15')),
    })
    const onReschedule = vi.fn()

    // When
    render(
      <CheckInCard
        checkIn={completedCheckIn}
        contactName="John Doe"
        onReschedule={onReschedule}
      />
    )

    // Then
    expect(screen.queryByRole('button', { name: /reschedule/i })).not.toBeInTheDocument()
  })

  it('should show completed status badge for completed check-ins', () => {
    // Given
    const completedCheckIn = createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2026-02-15')),
      completionDate: createCompletionDate(new Date('2026-02-15')),
    })

    // When
    render(<CheckInCard checkIn={completedCheckIn} contactName="John Doe" />)

    // Then
    expect(screen.getByText(/completed/i)).toBeInTheDocument()
  })
})
