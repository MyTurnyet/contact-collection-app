import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataImportSection } from '../DataImportSection'

describe('DataImportSection', () => {
  const mockOnImport = vi.fn()

  beforeEach(() => {
    mockOnImport.mockClear()
  })

  it('should display section title', () => {
    // When
    render(
      <DataImportSection
        onImport={mockOnImport}
        loading={false}
        error={null}
        success={false}
      />
    )

    // Then
    expect(screen.getByText(/import data/i)).toBeInTheDocument()
  })

  it('should show file input', () => {
    // When
    render(
      <DataImportSection
        onImport={mockOnImport}
        loading={false}
        error={null}
        success={false}
      />
    )

    // Then
    expect(screen.getByLabelText(/choose file/i)).toBeInTheDocument()
  })

  it('should call onImport when file is selected', async () => {
    // Given
    const user = userEvent.setup()
    const file = new File(['{"version": "1.0"}'], 'backup.json', {
      type: 'application/json',
    })

    // When
    render(
      <DataImportSection
        onImport={mockOnImport}
        loading={false}
        error={null}
        success={false}
      />
    )
    const input = screen.getByLabelText(/choose file/i)
    await user.upload(input, file)

    // Then
    expect(mockOnImport).toHaveBeenCalledWith(file)
  })

  it('should show error message when error prop is provided', () => {
    // When
    render(
      <DataImportSection
        onImport={mockOnImport}
        loading={false}
        error="Invalid file format"
        success={false}
      />
    )

    // Then
    expect(screen.getByText(/invalid file format/i)).toBeInTheDocument()
  })

  it('should show success message when success prop is true', () => {
    // When
    render(
      <DataImportSection
        onImport={mockOnImport}
        loading={false}
        error={null}
        success={true}
      />
    )

    // Then
    expect(screen.getByText(/import successful/i)).toBeInTheDocument()
  })

  it('should disable file input when loading', () => {
    // When
    render(
      <DataImportSection
        onImport={mockOnImport}
        loading={true}
        error={null}
        success={false}
      />
    )

    // Then
    expect(screen.getByLabelText(/choose file/i)).toBeDisabled()
  })
})
