import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactSearchBar } from '../ContactSearchBar'

describe('ContactSearchBar', () => {
  it('should render search input', () => {
    // When
    render(<ContactSearchBar onSearch={vi.fn()} />)

    // Then
    expect(screen.getByPlaceholderText(/search contacts/i)).toBeInTheDocument()
  })

  it('should call onSearch when typing', async () => {
    // Given
    const user = userEvent.setup()
    const onSearch = vi.fn()

    // When
    render(<ContactSearchBar onSearch={onSearch} />)
    await user.type(screen.getByPlaceholderText(/search contacts/i), 'J')

    // Then
    expect(onSearch).toHaveBeenCalledWith('J')
  })

  it('should display current value', () => {
    // When
    render(<ContactSearchBar value="Test" onSearch={vi.fn()} />)

    // Then
    expect(screen.getByDisplayValue('Test')).toBeInTheDocument()
  })

  it('should clear search when clear button clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onSearch = vi.fn()

    // When
    render(<ContactSearchBar value="Test" onSearch={onSearch} />)
    await user.click(screen.getByRole('button', { name: /clear/i }))

    // Then
    expect(onSearch).toHaveBeenCalledWith('')
  })
})
