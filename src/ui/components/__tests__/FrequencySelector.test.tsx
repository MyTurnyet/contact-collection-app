import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FrequencySelector } from '../FrequencySelector'

describe('FrequencySelector', () => {
  it('should display value input', () => {
    // When
    render(
      <FrequencySelector
        value={7}
        unit="days"
        onValueChange={vi.fn()}
        onUnitChange={vi.fn()}
      />
    )

    // Then
    expect(screen.getByLabelText(/frequency value/i)).toHaveValue(7)
  })

  it('should display unit selector', () => {
    // When
    render(
      <FrequencySelector
        value={1}
        unit="weeks"
        onValueChange={vi.fn()}
        onUnitChange={vi.fn()}
      />
    )

    // Then
    expect(screen.getByLabelText(/frequency unit/i)).toHaveTextContent('weeks')
  })

  it('should call onValueChange when value changes', async () => {
    // Given
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    // When
    render(
      <FrequencySelector
        value={7}
        unit="days"
        onValueChange={onValueChange}
        onUnitChange={vi.fn()}
      />
    )
    const input = screen.getByLabelText(/frequency value/i)
    await user.click(input)
    await user.type(input, '3')

    // Then
    expect(onValueChange).toHaveBeenLastCalledWith(73)
  })

  it('should call onUnitChange when unit changes', async () => {
    // Given
    const user = userEvent.setup()
    const onUnitChange = vi.fn()

    // When
    render(
      <FrequencySelector
        value={1}
        unit="days"
        onValueChange={vi.fn()}
        onUnitChange={onUnitChange}
      />
    )
    await user.click(screen.getByLabelText(/frequency unit/i))
    await user.click(screen.getByRole('option', { name: /weeks/i }))

    // Then
    expect(onUnitChange).toHaveBeenCalledWith('weeks')
  })

  it('should show all unit options', async () => {
    // Given
    const user = userEvent.setup()

    // When
    render(
      <FrequencySelector
        value={1}
        unit="days"
        onValueChange={vi.fn()}
        onUnitChange={vi.fn()}
      />
    )
    await user.click(screen.getByLabelText(/frequency unit/i))

    // Then
    expect(screen.getByRole('option', { name: /^days$/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /^weeks$/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /^months$/i })).toBeInTheDocument()
  })
})
