import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CategoryFilter } from '../CategoryFilter'
import { createCategory } from '../../../domain/category/Category'
import { createCategoryId } from '../../../domain/category/CategoryId'
import { createCategoryName } from '../../../domain/category/CategoryName'
import { createCheckInFrequency } from '../../../domain/category/CheckInFrequency'

describe('CategoryFilter', () => {
  const mockCategories = [
    createCategory({
      id: createCategoryId(),
      name: createCategoryName('Family'),
      frequency: createCheckInFrequency({ value: 1, unit: 'months' }),
    }),
    createCategory({
      id: createCategoryId(),
      name: createCategoryName('Friends'),
      frequency: createCheckInFrequency({ value: 2, unit: 'months' }),
    }),
  ]

  it('should render filter control', () => {
    // When
    render(<CategoryFilter categories={mockCategories} onFilterChange={vi.fn()} />)

    // Then
    expect(screen.getByLabelText('Filter by Category')).toBeInTheDocument()
  })

  it('should display all categories option when opened', async () => {
    // Given
    const user = userEvent.setup()

    // When
    render(<CategoryFilter categories={mockCategories} onFilterChange={vi.fn()} />)
    const select = screen.getByLabelText('Filter by Category')
    await user.click(select)

    // Then
    expect(screen.getByText('All Categories')).toBeInTheDocument()
  })

  it('should display all category names when opened', async () => {
    // Given
    const user = userEvent.setup()

    // When
    render(<CategoryFilter categories={mockCategories} onFilterChange={vi.fn()} />)
    const select = screen.getByLabelText('Filter by Category')
    await user.click(select)

    // Then
    expect(screen.getByText('Family')).toBeInTheDocument()
    expect(screen.getByText('Friends')).toBeInTheDocument()
  })

  it('should call onFilterChange with null when All Categories selected', async () => {
    // Given
    const user = userEvent.setup()
    const onFilterChange = vi.fn()

    // When
    render(<CategoryFilter categories={mockCategories} onFilterChange={onFilterChange} selectedCategoryId={mockCategories[0].id} />)
    const select = screen.getByLabelText('Filter by Category')
    await user.click(select)
    await user.click(screen.getByText('All Categories'))

    // Then
    expect(onFilterChange).toHaveBeenCalledWith(null)
  })

  it('should call onFilterChange with categoryId when category selected', async () => {
    // Given
    const user = userEvent.setup()
    const onFilterChange = vi.fn()

    // When
    render(<CategoryFilter categories={mockCategories} onFilterChange={onFilterChange} />)
    const select = screen.getByLabelText('Filter by Category')
    await user.click(select)
    await user.click(screen.getByText('Family'))

    // Then
    expect(onFilterChange).toHaveBeenCalledWith(mockCategories[0].id)
  })
})
