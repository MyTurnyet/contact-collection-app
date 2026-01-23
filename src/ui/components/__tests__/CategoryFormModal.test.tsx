import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CategoryFormModal } from '../CategoryFormModal'
import { createCategory } from '../../../domain/category/Category'
import { createCategoryId } from '../../../domain/category/CategoryId'
import { createCategoryName } from '../../../domain/category/CategoryName'
import { createCheckInFrequency } from '../../../domain/category/CheckInFrequency'

describe('CategoryFormModal', () => {
  const mockCategory = createCategory({
    id: createCategoryId(),
    name: createCategoryName('Family'),
    frequency: createCheckInFrequency({ value: 1, unit: 'weeks' }),
  })

  it('should display create title when no category provided', () => {
    // When
    render(<CategoryFormModal open onClose={vi.fn()} onSave={vi.fn()} />)

    // Then
    expect(screen.getByText('Create Category')).toBeInTheDocument()
  })

  it('should display edit title when category provided', () => {
    // When
    render(
      <CategoryFormModal
        open
        category={mockCategory}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    )

    // Then
    expect(screen.getByText('Edit Category')).toBeInTheDocument()
  })

  it('should display empty form fields for create mode', () => {
    // When
    render(<CategoryFormModal open onClose={vi.fn()} onSave={vi.fn()} />)

    // Then
    expect(screen.getByLabelText(/^name/i)).toHaveValue('')
    expect(screen.getByLabelText(/frequency value/i)).toHaveValue(1)
  })

  it('should display pre-filled form fields for edit mode', () => {
    // When
    render(
      <CategoryFormModal
        open
        category={mockCategory}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    )

    // Then
    expect(screen.getByLabelText(/^name/i)).toHaveValue('Family')
    expect(screen.getByLabelText(/frequency value/i)).toHaveValue(1)
    expect(screen.getByLabelText(/frequency unit/i)).toHaveTextContent('weeks')
  })

  it('should call onSave with form data when save clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onSave = vi.fn()

    // When
    render(<CategoryFormModal open onClose={vi.fn()} onSave={onSave} />)
    await user.type(screen.getByLabelText(/^name/i), 'Close Friends')
    const frequencyInput = screen.getByLabelText(/frequency value/i)
    await user.click(frequencyInput)
    await user.type(frequencyInput, '4')
    await user.click(screen.getByLabelText(/frequency unit/i))
    await user.click(screen.getByRole('option', { name: /weeks/i }))
    await user.click(screen.getByRole('button', { name: /save/i }))

    // Then
    expect(onSave).toHaveBeenCalledWith({
      name: 'Close Friends',
      frequencyValue: 14,
      frequencyUnit: 'weeks',
    })
  })

  it('should call onClose when cancel clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onClose = vi.fn()

    // When
    render(<CategoryFormModal open onClose={onClose} onSave={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    // Then
    expect(onClose).toHaveBeenCalled()
  })

  it('should show validation error when name is empty', async () => {
    // Given
    const user = userEvent.setup()
    const onSave = vi.fn()

    // When
    render(<CategoryFormModal open onClose={vi.fn()} onSave={onSave} />)
    await user.click(screen.getByRole('button', { name: /save/i }))

    // Then
    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  it('should show validation error when frequency value is invalid', async () => {
    // Given
    const user = userEvent.setup()
    const onSave = vi.fn()

    // When
    render(<CategoryFormModal open onClose={vi.fn()} onSave={onSave} />)
    await user.type(screen.getByLabelText(/^name/i), 'Family')
    const frequencyInput = screen.getByLabelText(/frequency value/i)
    await user.click(frequencyInput)
    await user.type(frequencyInput, '000')
    await user.click(screen.getByRole('button', { name: /save/i }))

    // Then
    expect(screen.getByText(/frequency value cannot exceed 365/i)).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })
})
