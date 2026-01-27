import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CategoryListPage } from '../CategoryListPage'
import { DependencyProvider } from '../../../di'
import { DIContainer } from '../../../di/DIContainer'

describe('CategoryListPage', () => {
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

  it('should display loading state initially', async () => {
    // When
    render(<CategoryListPage />, { wrapper })

    // Then
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create category/i })).toBeInTheDocument()
    })
  })

  it('should display empty state when no categories', async () => {
    // When
    render(<CategoryListPage />, { wrapper })

    // Then
    await waitFor(() => {
      expect(screen.getByText(/no categories yet/i)).toBeInTheDocument()
    })
  }, 15000)

  it('should display create button', async () => {
    // When
    render(<CategoryListPage />, { wrapper })

    // Then
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create category/i })).toBeInTheDocument()
    })
  })

  it('should display load defaults button', async () => {
    // When
    render(<CategoryListPage />, { wrapper })

    // Then
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /load defaults/i })).toBeInTheDocument()
    })
  })

  it('should open create modal when create button clicked', async () => {
    // Given
    const user = userEvent.setup()
    render(<CategoryListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create category/i })).toBeInTheDocument()
    })

    // When
    await user.click(screen.getByRole('button', { name: /create category/i }))

    // Then
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should display categories after creation', async () => {
    // Given
    const user = userEvent.setup()
    render(<CategoryListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create category/i })).toBeInTheDocument()
    })

    // When - Create a category
    await user.click(screen.getByRole('button', { name: /create category/i }))
    await user.type(screen.getByLabelText(/^name/i), 'Family')
    await user.click(screen.getByLabelText(/frequency unit/i))
    await user.click(screen.getByRole('option', { name: /weeks/i }))
    await user.click(screen.getByRole('button', { name: /save/i }))

    // Then
    await waitFor(() => {
      expect(screen.getByText('Family')).toBeInTheDocument()
    })
  }, 15000)

  it('should load default categories when load defaults clicked', async () => {
    // Given
    const user = userEvent.setup()
    render(<CategoryListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /load defaults/i })).toBeInTheDocument()
    })

    // When
    await user.click(screen.getByRole('button', { name: /load defaults/i }))

    // Then
    await waitFor(() => {
      expect(screen.getByText('Family')).toBeInTheDocument()
      expect(screen.getByText('Close Friends')).toBeInTheDocument()
      expect(screen.getByText('Friends')).toBeInTheDocument()
    })
  }, 15000)

  it('should display error state when storage fails', async () => {
    const proto = Object.getPrototypeOf(localStorage) as Storage
    const spy = vi.spyOn(proto, 'getItem').mockImplementation(() => {
      throw new Error('Storage error')
    })

    render(<CategoryListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByText('Storage error')).toBeInTheDocument()
    })

    spy.mockRestore()
  }, 15000)

  it('should delete a category from the list', async () => {
    const user = userEvent.setup()
    render(<CategoryListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create category/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /create category/i }))
    await user.type(screen.getByLabelText(/^name/i), 'Family')
    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByText('Family')).toBeInTheDocument()
    })

    await user.click(screen.getByLabelText('delete'))

    await waitFor(() => {
      expect(screen.getByText(/no categories yet/i)).toBeInTheDocument()
    })
  }, 15000)

  it('should edit a category and update it in the list', async () => {
    const user = userEvent.setup()
    render(<CategoryListPage />, { wrapper })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create category/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /create category/i }))
    await user.type(screen.getByLabelText(/^name/i), 'Family')
    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByText('Family')).toBeInTheDocument()
    })

    await user.click(screen.getByLabelText('edit'))
    const dialog = screen.getByRole('dialog', { name: /edit category/i })
    expect(dialog).toBeInTheDocument()

    const name = within(dialog).getByLabelText(/^name/i)
    await user.clear(name)
    await user.type(name, 'Friends')
    await user.click(within(dialog).getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByText('Friends')).toBeInTheDocument()
    })
  }, 15000)
})
