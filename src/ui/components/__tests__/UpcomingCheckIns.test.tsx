import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UpcomingCheckIns } from '../UpcomingCheckIns'
import { createCheckIn } from '../../../domain/checkin/CheckIn'
import { createCheckInId } from '../../../domain/checkin/CheckInId'
import { createContactId } from '../../../domain/contact/ContactId'
import { createScheduledDate } from '../../../domain/checkin/ScheduledDate'

describe('UpcomingCheckIns', () => {
  const mockCheckIns = [
    createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2026-02-01')),
    }),
    createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2026-02-02')),
    }),
  ]

  const mockContactNames = new Map([
    [mockCheckIns[0].contactId, 'John Doe'],
    [mockCheckIns[1].contactId, 'Jane Smith'],
  ])

  it('should display section title', () => {
    // When
    render(
      <UpcomingCheckIns
        checkIns={mockCheckIns}
        contactNames={mockContactNames}
      />
    )

    // Then
    expect(screen.getByText(/upcoming check-ins/i)).toBeInTheDocument()
  })

  it('should display all upcoming check-ins', () => {
    // When
    render(
      <UpcomingCheckIns
        checkIns={mockCheckIns}
        contactNames={mockContactNames}
      />
    )

    // Then
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('should display empty state when no check-ins', () => {
    // When
    render(
      <UpcomingCheckIns checkIns={[]} contactNames={new Map()} />
    )

    // Then
    expect(screen.getByText(/no upcoming check-ins/i)).toBeInTheDocument()
  })

  it('should pass complete handler to cards', () => {
    // Given
    const onComplete = vi.fn()

    // When
    render(
      <UpcomingCheckIns
        checkIns={mockCheckIns}
        contactNames={mockContactNames}
        onComplete={onComplete}
      />
    )

    // Then
    expect(screen.getAllByRole('button', { name: /complete/i })).toHaveLength(2)
  })

  it('should pass reschedule handler to cards', () => {
    // Given
    const onReschedule = vi.fn()

    // When
    render(
      <UpcomingCheckIns
        checkIns={mockCheckIns}
        contactNames={mockContactNames}
        onReschedule={onReschedule}
      />
    )

    // Then
    expect(screen.getAllByRole('button', { name: /reschedule/i })).toHaveLength(2)
  })
})
