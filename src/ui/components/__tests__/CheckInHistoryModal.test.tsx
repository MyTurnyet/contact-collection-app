import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CheckInHistoryModal } from '../CheckInHistoryModal'
import { createCheckIn } from '../../../domain/checkin/CheckIn'
import { createCheckInId } from '../../../domain/checkin/CheckInId'
import { createContactId } from '../../../domain/contact/ContactId'
import { createScheduledDate } from '../../../domain/checkin/ScheduledDate'
import { createCompletionDate } from '../../../domain/checkin/CompletionDate'
import { createCheckInNotes } from '../../../domain/checkin/CheckInNotes'

describe('CheckInHistoryModal', () => {
  const contactId = createContactId()
  const mockHistory = [
    createCheckIn({
      id: createCheckInId(),
      contactId,
      scheduledDate: createScheduledDate(new Date('2026-01-15T12:00:00')),
      completionDate: createCompletionDate(new Date('2026-01-15T12:00:00')),
      notes: createCheckInNotes('Great conversation'),
    }),
    createCheckIn({
      id: createCheckInId(),
      contactId,
      scheduledDate: createScheduledDate(new Date('2026-01-01T12:00:00')),
      completionDate: createCompletionDate(new Date('2026-01-02T12:00:00')),
      notes: createCheckInNotes('Quick catch up'),
    }),
  ]

  const mockContactName = 'John Doe'

  it('should display modal title with contact name', () => {
    // When
    render(
      <CheckInHistoryModal
        open
        contactName={mockContactName}
        history={mockHistory}
        onClose={vi.fn()}
      />
    )

    // Then
    expect(screen.getByText(/check-in history.*john doe/i)).toBeInTheDocument()
  })

  it('should display all check-in history items', () => {
    // When
    render(
      <CheckInHistoryModal
        open
        contactName={mockContactName}
        history={mockHistory}
        onClose={vi.fn()}
      />
    )

    // Then
    expect(screen.getByText(/scheduled.*jan 15, 2026/i)).toBeInTheDocument()
    expect(screen.getByText(/scheduled.*jan 1, 2026/i)).toBeInTheDocument()
  })

  it('should display notes for check-ins', () => {
    // When
    render(
      <CheckInHistoryModal
        open
        contactName={mockContactName}
        history={mockHistory}
        onClose={vi.fn()}
      />
    )

    // Then
    expect(screen.getByText('Great conversation')).toBeInTheDocument()
    expect(screen.getByText('Quick catch up')).toBeInTheDocument()
  })

  it('should display empty state when no history', () => {
    // When
    render(
      <CheckInHistoryModal
        open
        contactName={mockContactName}
        history={[]}
        onClose={vi.fn()}
      />
    )

    // Then
    expect(screen.getByText(/no check-in history/i)).toBeInTheDocument()
  })

  it('should call onClose when close button clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onClose = vi.fn()

    // When
    render(
      <CheckInHistoryModal
        open
        contactName={mockContactName}
        history={mockHistory}
        onClose={onClose}
      />
    )
    await user.click(screen.getByRole('button', { name: /close/i }))

    // Then
    expect(onClose).toHaveBeenCalled()
  })

  it('should display completion date for each check-in', () => {
    // When
    render(
      <CheckInHistoryModal
        open
        contactName={mockContactName}
        history={mockHistory}
        onClose={vi.fn()}
      />
    )

    // Then
    expect(screen.getByText(/completed.*jan 15, 2026/i)).toBeInTheDocument()
    expect(screen.getByText(/completed.*jan 2, 2026/i)).toBeInTheDocument()
  })
})
