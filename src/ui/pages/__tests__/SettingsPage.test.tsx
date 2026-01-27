import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { SettingsPage } from '../SettingsPage'
import { DependencyProvider } from '../../../di'
import { DIContainer } from '../../../di/DIContainer'

function createFileWithText(content: string): File {
  const file = new File([content], 'import.json', { type: 'application/json' })
  Object.defineProperty(file, 'text', {
    configurable: true,
    value: async () => content,
  })
  return file
}

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

  function stubAnchorClick() {
    const original = HTMLAnchorElement.prototype.click
    const spy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined)
    return {
      restore: () => {
        spy.mockRestore()
        HTMLAnchorElement.prototype.click = original
      },
    }
  }

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
    const anchorClick = stubAnchorClick()
    render(<SettingsPage />, { wrapper })

    // When
    await user.click(screen.getByRole('button', { name: /export as json/i }))

    // Then
    await waitFor(() => {
      expect(createElementSpy).toHaveBeenCalledWith('a')
    })

    anchorClick.restore()
    createElementSpy.mockRestore()
  })

  it('should handle export CSV button click', async () => {
    const user = userEvent.setup()

    // Given
    const createElementSpy = vi.spyOn(document, 'createElement')
    const anchorClick = stubAnchorClick()
    render(<SettingsPage />, { wrapper })

    // When
    await user.click(screen.getByRole('button', { name: /export contacts as csv/i }))

    // Then
    await waitFor(() => {
      expect(createElementSpy).toHaveBeenCalledWith('a')
    })

    anchorClick.restore()
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
    const anchorClick = stubAnchorClick()
    render(<SettingsPage />, { wrapper })

    // When
    await user.click(screen.getByRole('button', { name: /create backup now/i }))

    // Then
    await waitFor(() => {
      expect(createElementSpy).toHaveBeenCalled()
    })

    anchorClick.restore()
    createElementSpy.mockRestore()
  })

  it('should show notification toggle after permission is granted', async () => {
    const user = userEvent.setup()

    const originalNotification = (globalThis as unknown as { Notification?: unknown }).Notification

    class FakeNotification {
      static requestPermission() {
        return Promise.resolve('granted' as const)
      }
    }

    ;(globalThis as unknown as { Notification?: unknown }).Notification =
      FakeNotification as unknown

    try {
      render(<SettingsPage />, { wrapper })
      await user.click(screen.getByRole('button', { name: /request permission/i }))

      await waitFor(() => {
        expect(
          screen.getByLabelText(/enable browser notifications/i)
        ).toBeInTheDocument()
      })
    } finally {
      ;(globalThis as unknown as { Notification?: unknown }).Notification = originalNotification
    }
  })

  it('should toggle notification enabled state when switch clicked', async () => {
    const user = userEvent.setup()

    const originalNotification = (globalThis as unknown as { Notification?: unknown }).Notification

    class FakeNotification {
      static requestPermission() {
        return Promise.resolve('granted' as const)
      }
    }

    ;(globalThis as unknown as { Notification?: unknown }).Notification =
      FakeNotification as unknown

    try {
      render(<SettingsPage />, { wrapper })
      await user.click(screen.getByRole('button', { name: /request permission/i }))

      const toggle = await screen.findByLabelText(/enable browser notifications/i)

      expect(toggle).not.toBeChecked()
      await user.click(toggle)
      expect(toggle).toBeChecked()
    } finally {
      ;(globalThis as unknown as { Notification?: unknown }).Notification = originalNotification
    }
  })

  it('should show import success message for valid file', async () => {
    const user = userEvent.setup()
    render(<SettingsPage />, { wrapper })

    const fileInput = screen.getByLabelText(/choose file/i)
    const file = createFileWithText(
      JSON.stringify({ version: '1.0', contacts: [], categories: [], checkIns: [] })
    )

    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(screen.getByText(/import successful!/i)).toBeInTheDocument()
    })
  })

  it('should show import error message for invalid file', async () => {
    const user = userEvent.setup()
    render(<SettingsPage />, { wrapper })

    const fileInput = screen.getByLabelText(/choose file/i)
    const file = createFileWithText('not-json')

    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(screen.getByText(/invalid json format/i)).toBeInTheDocument()
    })
  })

  it('should show unknown error message when file read fails with non-Error', async () => {
    const user = userEvent.setup()
    render(<SettingsPage />, { wrapper })

    const fileInput = screen.getByLabelText(/choose file/i)
    const file = createFileWithText('')

    Object.defineProperty(file, 'text', {
      value: async () => {
        throw 'nope'
      },
    })

    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(screen.getByText(/an unknown error occurred/i)).toBeInTheDocument()
    })
  })
})
