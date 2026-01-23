import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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

  it('should display loading state initially', () => {
    // When
    render(<CategoryListPage />, { wrapper })

    // Then
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should display empty state when no categories', async () => {
    // When
    render(<CategoryListPage />, { wrapper })

    // Then
    await waitFor(() => {
      expect(screen.getByText(/no categories yet/i)).toBeInTheDocument()
    })
  })

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
  })

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
  })
})
