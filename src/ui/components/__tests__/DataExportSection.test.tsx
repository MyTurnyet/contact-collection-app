import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataExportSection } from '../DataExportSection'

describe('DataExportSection', () => {
  const mockOnExportJson = vi.fn()
  const mockOnExportCsv = vi.fn()

  beforeEach(() => {
    mockOnExportJson.mockClear()
    mockOnExportCsv.mockClear()
  })

  it('should display section title', () => {
    // When
    render(
      <DataExportSection
        onExportJson={mockOnExportJson}
        onExportCsv={mockOnExportCsv}
        loading={false}
      />
    )

    // Then
    expect(screen.getByText(/export data/i)).toBeInTheDocument()
  })

  it('should show export JSON button', () => {
    // When
    render(
      <DataExportSection
        onExportJson={mockOnExportJson}
        onExportCsv={mockOnExportCsv}
        loading={false}
      />
    )

    // Then
    expect(screen.getByRole('button', { name: /export as json/i })).toBeInTheDocument()
  })

  it('should show export CSV button', () => {
    // When
    render(
      <DataExportSection
        onExportJson={mockOnExportJson}
        onExportCsv={mockOnExportCsv}
        loading={false}
      />
    )

    // Then
    expect(screen.getByRole('button', { name: /export contacts as csv/i })).toBeInTheDocument()
  })

  it('should call onExportJson when JSON button clicked', async () => {
    // Given
    const user = userEvent.setup()

    // When
    render(
      <DataExportSection
        onExportJson={mockOnExportJson}
        onExportCsv={mockOnExportCsv}
        loading={false}
      />
    )
    await user.click(screen.getByRole('button', { name: /export as json/i }))

    // Then
    expect(mockOnExportJson).toHaveBeenCalled()
  })

  it('should call onExportCsv when CSV button clicked', async () => {
    // Given
    const user = userEvent.setup()

    // When
    render(
      <DataExportSection
        onExportJson={mockOnExportJson}
        onExportCsv={mockOnExportCsv}
        loading={false}
      />
    )
    await user.click(screen.getByRole('button', { name: /export contacts as csv/i }))

    // Then
    expect(mockOnExportCsv).toHaveBeenCalled()
  })

  it('should disable buttons when loading', () => {
    // When
    render(
      <DataExportSection
        onExportJson={mockOnExportJson}
        onExportCsv={mockOnExportCsv}
        loading={true}
      />
    )

    // Then
    expect(screen.getByRole('button', { name: /export as json/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /export contacts as csv/i })).toBeDisabled()
  })
})
