import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OverdueCheckIns } from '../OverdueCheckIns'
import { createCheckIn } from '../../../domain/checkin/CheckIn'
import { createCheckInId } from '../../../domain/checkin/CheckInId'
import { createContactId } from '../../../domain/contact/ContactId'
import { createScheduledDate } from '../../../domain/checkin/ScheduledDate'

describe('OverdueCheckIns', () => {
  const mockCheckIns = [
    createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2020-01-01')),
    }),
    createCheckIn({
      id: createCheckInId(),
      contactId: createContactId(),
      scheduledDate: createScheduledDate(new Date('2020-01-02')),
    }),
  ]

  const mockContactNames = new Map([
    [mockCheckIns[0].contactId, 'John Doe'],
    [mockCheckIns[1].contactId, 'Jane Smith'],
  ])

  it('should display section title', () => {
    // When
    render(
      <OverdueCheckIns
        checkIns={mockCheckIns}
        contactNames={mockContactNames}
      />
    )

    // Then
    expect(screen.getByText(/overdue check-ins/i)).toBeInTheDocument()
  })

  it('should display all overdue check-ins', () => {
    // When
    render(
      <OverdueCheckIns
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
      <OverdueCheckIns checkIns={[]} contactNames={new Map()} />
    )

    // Then
    expect(screen.getByText(/no overdue check-ins/i)).toBeInTheDocument()
  })

  it('should pass complete handler to cards', () => {
    // Given
    const onComplete = vi.fn()

    // When
    render(
      <OverdueCheckIns
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
      <OverdueCheckIns
        checkIns={mockCheckIns}
        contactNames={mockContactNames}
        onReschedule={onReschedule}
      />
    )

    // Then
    expect(screen.getAllByRole('button', { name: /reschedule/i })).toHaveLength(2)
  })
})
