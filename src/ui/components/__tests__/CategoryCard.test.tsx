import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CategoryCard } from '../CategoryCard'
import { createCategory } from '../../../domain/category/Category'
import { createCategoryId } from '../../../domain/category/CategoryId'
import { createCategoryName } from '../../../domain/category/CategoryName'
import { createCheckInFrequency } from '../../../domain/category/CheckInFrequency'

describe('CategoryCard', () => {
  const mockCategory = createCategory({
    id: createCategoryId(),
    name: createCategoryName('Family'),
    frequency: createCheckInFrequency({ value: 1, unit: 'weeks' }),
  })

  it('should display category name', () => {
    // When
    render(<CategoryCard category={mockCategory} />)

    // Then
    expect(screen.getByText('Family')).toBeInTheDocument()
  })

  it('should display formatted frequency', () => {
    // When
    render(<CategoryCard category={mockCategory} />)

    // Then
    expect(screen.getByText('Every 1 week')).toBeInTheDocument()
  })

  it('should call onEdit when edit button clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onEdit = vi.fn()

    // When
    render(<CategoryCard category={mockCategory} onEdit={onEdit} />)
    await user.click(screen.getByRole('button', { name: /edit/i }))

    // Then
    expect(onEdit).toHaveBeenCalledWith(mockCategory)
  })

  it('should call onDelete when delete button clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onDelete = vi.fn()

    // When
    render(<CategoryCard category={mockCategory} onDelete={onDelete} />)
    await user.click(screen.getByRole('button', { name: /delete/i }))

    // Then
    expect(onDelete).toHaveBeenCalledWith(mockCategory.id)
  })

  it('should not show edit button when onEdit not provided', () => {
    // When
    render(<CategoryCard category={mockCategory} onDelete={vi.fn()} />)

    // Then
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
  })

  it('should not show delete button when onDelete not provided', () => {
    // When
    render(<CategoryCard category={mockCategory} onEdit={vi.fn()} />)

    // Then
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
  })
})
