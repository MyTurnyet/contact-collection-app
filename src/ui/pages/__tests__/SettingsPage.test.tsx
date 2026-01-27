import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { SettingsPage } from '../SettingsPage'
import { DependencyProvider } from '../../../di'
import { DIContainer } from '../../../di/DIContainer'

describe('SettingsPage', () => {
  let container: DIContainer

  beforeEach(() => {
    container = new DIContainer()
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DependencyProvider container={container}>{children}</DependencyProvider>
  )

  it('should display page title', () => {
    // When
    render(<SettingsPage />, { wrapper })

    // Then
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('should display notification settings section', () => {
    // When
    render(<SettingsPage />, { wrapper })

    // Then
    expect(screen.getByText(/notification settings/i)).toBeInTheDocument()
  })

  it('should display export data section', () => {
    // When
    render(<SettingsPage />, { wrapper })

    // Then
    expect(screen.getByText(/export data/i)).toBeInTheDocument()
  })

  it('should display import data section', () => {
    // When
    render(<SettingsPage />, { wrapper })

    // Then
    expect(screen.getByText(/import data/i)).toBeInTheDocument()
  })

  it('should show export buttons', () => {
    // When
    render(<SettingsPage />, { wrapper })

    // Then
    expect(screen.getByRole('button', { name: /export as json/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /export contacts as csv/i })).toBeInTheDocument()
  })

  it('should show import file input', () => {
    // When
    render(<SettingsPage />, { wrapper })

    // Then
    expect(screen.getByLabelText(/choose file/i)).toBeInTheDocument()
  })

  it('should handle export JSON button click', async () => {
    const user = userEvent.setup()

    // Given
    const createElementSpy = vi.spyOn(document, 'createElement')
    render(<SettingsPage />, { wrapper })

    // When
    await user.click(screen.getByRole('button', { name: /export as json/i }))

    // Then
    await waitFor(() => {
      expect(createElementSpy).toHaveBeenCalledWith('a')
    })

    createElementSpy.mockRestore()
  })

  it('should handle export CSV button click', async () => {
    const user = userEvent.setup()

    // Given
    const createElementSpy = vi.spyOn(document, 'createElement')
    render(<SettingsPage />, { wrapper })

    // When
    await user.click(screen.getByRole('button', { name: /export contacts as csv/i }))

    // Then
    await waitFor(() => {
      expect(createElementSpy).toHaveBeenCalledWith('a')
    })

    createElementSpy.mockRestore()
  })

  it('should render import section with file input', () => {
    // Given
    render(<SettingsPage />, { wrapper })

    // Then - File input is present and ready for use
    const fileInput = screen.getByLabelText(/choose file/i) as HTMLInputElement
    expect(fileInput).toBeInTheDocument()
    expect(fileInput.accept).toBe('.json')
  })

  it('should show notification permission request button', () => {
    // When
    render(<SettingsPage />, { wrapper })

    // Then - Initially shows request permission button (not toggle)
    expect(screen.getByRole('button', { name: /request permission/i })).toBeInTheDocument()
  })

  it('should show backup section', () => {
    // When
    render(<SettingsPage />, { wrapper })

    // Then
    expect(screen.getByText(/automatic backups/i)).toBeInTheDocument()
  })

  it('should handle backup button click', async () => {
    const user = userEvent.setup()

    // Given
    const createElementSpy = vi.spyOn(document, 'createElement')
    render(<SettingsPage />, { wrapper })

    // When
    await user.click(screen.getByRole('button', { name: /create backup now/i }))

    // Then
    await waitFor(() => {
      expect(createElementSpy).toHaveBeenCalled()
    })

    createElementSpy.mockRestore()
  })
})
