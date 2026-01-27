import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { BackupSection } from '../BackupSection'

describe('BackupSection', () => {
  it('should display backup section title', () => {
    // When
    render(<BackupSection onCreateBackup={vi.fn()} loading={false} />)

    // Then
    expect(screen.getByText(/automatic backups/i)).toBeInTheDocument()
  })

  it('should display create backup button', () => {
    // When
    render(<BackupSection onCreateBackup={vi.fn()} loading={false} />)

    // Then
    expect(screen.getByRole('button', { name: /create backup now/i })).toBeInTheDocument()
  })

  it('should call onCreateBackup when button clicked', async () => {
    // Given
    const user = userEvent.setup()
    const onCreateBackup = vi.fn()
    render(<BackupSection onCreateBackup={onCreateBackup} loading={false} />)

    // When
    await user.click(screen.getByRole('button', { name: /create backup now/i }))

    // Then
    expect(onCreateBackup).toHaveBeenCalledOnce()
  })

  it('should disable button when loading', () => {
    // When
    render(<BackupSection onCreateBackup={vi.fn()} loading={true} />)

    // Then
    expect(screen.getByRole('button', { name: /creating backup/i })).toBeDisabled()
  })

  it('should show loading text when creating backup', () => {
    // When
    render(<BackupSection onCreateBackup={vi.fn()} loading={true} />)

    // Then
    expect(screen.getByText(/creating backup/i)).toBeInTheDocument()
  })
})
