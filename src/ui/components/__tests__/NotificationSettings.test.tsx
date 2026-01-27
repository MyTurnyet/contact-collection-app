import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NotificationSettings } from '../NotificationSettings'

describe('NotificationSettings', () => {
  const mockOnPermissionRequest = vi.fn()
  const mockOnToggle = vi.fn()

  beforeEach(() => {
    mockOnPermissionRequest.mockClear()
    mockOnToggle.mockClear()
  })

  it('should display section title', () => {
    // When
    render(
      <NotificationSettings
        enabled={false}
        permissionState="default"
        onPermissionRequest={mockOnPermissionRequest}
        onToggle={mockOnToggle}
      />
    )

    // Then
    expect(screen.getByText(/notification settings/i)).toBeInTheDocument()
  })

  it('should show request permission button when permission is default', () => {
    // When
    render(
      <NotificationSettings
        enabled={false}
        permissionState="default"
        onPermissionRequest={mockOnPermissionRequest}
        onToggle={mockOnToggle}
      />
    )

    // Then
    expect(screen.getByRole('button', { name: /request permission/i })).toBeInTheDocument()
  })

  it('should call onPermissionRequest when request button clicked', async () => {
    // Given
    const user = userEvent.setup()

    // When
    render(
      <NotificationSettings
        enabled={false}
        permissionState="default"
        onPermissionRequest={mockOnPermissionRequest}
        onToggle={mockOnToggle}
      />
    )
    await user.click(screen.getByRole('button', { name: /request permission/i }))

    // Then
    expect(mockOnPermissionRequest).toHaveBeenCalled()
  })

  it('should show toggle switch when permission is granted', () => {
    // When
    render(
      <NotificationSettings
        enabled={true}
        permissionState="granted"
        onPermissionRequest={mockOnPermissionRequest}
        onToggle={mockOnToggle}
      />
    )

    // Then
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('should show enabled state when notifications are enabled', () => {
    // When
    render(
      <NotificationSettings
        enabled={true}
        permissionState="granted"
        onPermissionRequest={mockOnPermissionRequest}
        onToggle={mockOnToggle}
      />
    )

    // Then
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeChecked()
  })

  it('should call onToggle when switch is clicked', async () => {
    // Given
    const user = userEvent.setup()

    // When
    render(
      <NotificationSettings
        enabled={true}
        permissionState="granted"
        onPermissionRequest={mockOnPermissionRequest}
        onToggle={mockOnToggle}
      />
    )
    await user.click(screen.getByRole('switch'))

    // Then
    expect(mockOnToggle).toHaveBeenCalled()
  })

  it('should show denied message when permission is denied', () => {
    // When
    render(
      <NotificationSettings
        enabled={false}
        permissionState="denied"
        onPermissionRequest={mockOnPermissionRequest}
        onToggle={mockOnToggle}
      />
    )

    // Then
    expect(screen.getByText(/permission denied/i)).toBeInTheDocument()
  })

  it('should not show toggle switch when permission is denied', () => {
    // When
    render(
      <NotificationSettings
        enabled={false}
        permissionState="denied"
        onPermissionRequest={mockOnPermissionRequest}
        onToggle={mockOnToggle}
      />
    )

    // Then
    expect(screen.queryByRole('switch')).not.toBeInTheDocument()
  })

  it('should not show request button when permission is denied', () => {
    // When
    render(
      <NotificationSettings
        enabled={false}
        permissionState="denied"
        onPermissionRequest={mockOnPermissionRequest}
        onToggle={mockOnToggle}
      />
    )

    // Then
    expect(screen.queryByRole('button', { name: /request permission/i })).not.toBeInTheDocument()
  })
})
