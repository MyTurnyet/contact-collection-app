import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { WelcomeScreen } from '../WelcomeScreen'

describe('WelcomeScreen', () => {
  it('should display welcome message', () => {
    // Given
    const onComplete = vi.fn()

    // When
    render(<WelcomeScreen onComplete={onComplete} />)

    // Then
    expect(screen.getByText(/welcome/i)).toBeInTheDocument()
  })

  it('should display app description', () => {
    // Given
    const onComplete = vi.fn()

    // When
    render(<WelcomeScreen onComplete={onComplete} />)

    // Then
    expect(
      screen.getByText(/stay connected with the people who matter/i)
    ).toBeInTheDocument()
  })

  it('should have get started button', () => {
    // Given
    const onComplete = vi.fn()

    // When
    render(<WelcomeScreen onComplete={onComplete} />)

    // Then
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument()
  })

  it('should call onComplete when get started is clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<WelcomeScreen onComplete={onComplete} />)

    // When
    await user.click(screen.getByRole('button', { name: /get started/i }))

    // Then
    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('should display feature list', () => {
    // Given
    const onComplete = vi.fn()

    // When
    render(<WelcomeScreen onComplete={onComplete} />)

    // Then
    expect(screen.getByText(/track your contacts/i)).toBeInTheDocument()
    expect(screen.getByText(/schedule check-ins/i)).toBeInTheDocument()
  })
})
