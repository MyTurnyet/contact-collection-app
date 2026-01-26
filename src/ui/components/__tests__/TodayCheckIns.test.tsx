import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TodayCheckIns } from '../TodayCheckIns'
import { createCheckIn } from '../../../domain/checkin/CheckIn'
import { createCheckInId } from '../../../domain/checkin/CheckInId'
import { createContactId } from '../../../domain/contact/ContactId'
import { createScheduledDate } from '../../../domain/checkin/ScheduledDate'

describe('TodayCheckIns', () => {
  const today = new Date()
  const mockCheckIns = [
    createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(today),
    }),
    createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(today),
    }),
  ]

  const mockContactNames = new Map([
    [mockCheckIns[0].contactId, 'John Doe'],
    [mockCheckIns[1].contactId, 'Jane Smith'],
  ])

  it('should display section title', () => {
    // When
    render(
      <TodayCheckIns
        checkIns={mockCheckIns}
        contactNames={mockContactNames}
      />
    )

    // Then
    expect(screen.getByText(/today's check-ins/i)).toBeInTheDocument()
  })

  it('should display all today check-ins', () => {
    // When
    render(
      <TodayCheckIns
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
      <TodayCheckIns checkIns={[]} contactNames={new Map()} />
    )

    // Then
    expect(screen.getByText(/no check-ins scheduled for today/i)).toBeInTheDocument()
  })

  it('should pass complete handler to cards', () => {
    // Given
    const onComplete = vi.fn()

    // When
    render(
      <TodayCheckIns
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
      <TodayCheckIns
        checkIns={mockCheckIns}
        contactNames={mockContactNames}
        onReschedule={onReschedule}
      />
    )

    // Then
    expect(screen.getAllByRole('button', { name: /reschedule/i })).toHaveLength(2)
  })
})
