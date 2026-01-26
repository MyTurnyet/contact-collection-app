import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DashboardStats } from '../DashboardStats'
import type { DashboardSummary } from '../../../application/dashboard/DashboardSummary'

describe('DashboardStats', () => {
  const mockSummary: DashboardSummary = {
    overdueCount: 5,
    upcomingCount: 12,
    totalContacts: 25,
    contactsByCategory: new Map([
      ['Family', 8],
      ['Friends', 12],
      ['Colleagues', 5],
    ]),
  }

  it('should display overdue count', () => {
    // When
    render(<DashboardStats summary={mockSummary} />)

    // Then
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText(/overdue/i)).toBeInTheDocument()
  })

  it('should display upcoming count', () => {
    // When
    render(<DashboardStats summary={mockSummary} />)

    // Then
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText(/upcoming/i)).toBeInTheDocument()
  })

  it('should display total contacts count', () => {
    // When
    render(<DashboardStats summary={mockSummary} />)

    // Then
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText(/total contacts/i)).toBeInTheDocument()
  })

  it('should display all stat cards in a grid', () => {
    // When
    const { container } = render(<DashboardStats summary={mockSummary} />)

    // Then
    const cards = container.querySelectorAll('[data-testid="stat-card"]')
    expect(cards).toHaveLength(3)
  })
})
