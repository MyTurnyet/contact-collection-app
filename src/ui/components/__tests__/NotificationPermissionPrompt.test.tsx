import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NotificationPermissionPrompt } from '../NotificationPermissionPrompt'

describe('NotificationPermissionPrompt', () => {
  it('should not render when permission is granted', () => {
    // When
    render(
      <NotificationPermissionPrompt
        permission="granted"
        onRequestPermission={vi.fn()}
        onDismiss={vi.fn()}
      />
    )

    // Then
    expect(screen.queryByText(/notifications/i)).not.toBeInTheDocument()
  })

  it('should not render when permission is denied', () => {
    // When
    render(
      <NotificationPermissionPrompt
        permission="denied"
        onRequestPermission={vi.fn()}
        onDismiss={vi.fn()}
      />
    )

    // Then
    expect(screen.queryByText(/notifications/i)).not.toBeInTheDocument()
  })

  it('should render when permission is default', () => {
    // When
    render(
      <NotificationPermissionPrompt
        permission="default"
        onRequestPermission={vi.fn()}
        onDismiss={vi.fn()}
      />
    )

    // Then
    expect(screen.getByText(/enable notifications/i)).toBeInTheDocument()
  })

  it('should call onRequestPermission when enable button clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onRequestPermission = vi.fn()

    render(
      <NotificationPermissionPrompt
        permission="default"
        onRequestPermission={onRequestPermission}
        onDismiss={vi.fn()}
      />
    )

    // When
    await user.click(screen.getByRole('button', { name: /enable/i }))

    // Then
    expect(onRequestPermission).toHaveBeenCalled()
  })

  it('should call onDismiss when dismiss button clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onDismiss = vi.fn()

    render(
      <NotificationPermissionPrompt
        permission="default"
        onRequestPermission={vi.fn()}
        onDismiss={onDismiss}
      />
    )

    // When
    await user.click(screen.getByRole('button', { name: /later/i }))

    // Then
    expect(onDismiss).toHaveBeenCalled()
  })

  it('should display explanation message', () => {
    // When
    render(
      <NotificationPermissionPrompt
        permission="default"
        onRequestPermission={vi.fn()}
        onDismiss={vi.fn()}
      />
    )

    // Then
    expect(
      screen.getByText(/stay on top of your check-ins/i)
    ).toBeInTheDocument()
  })
})
