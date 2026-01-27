import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('should render navigation bar', () => {
    // When
    render(<App />)

    // Then
    expect(screen.getByText(/contact check-in/i)).toBeInTheDocument()
  })

  it('should render all navigation links', () => {
    // When
    render(<App />)

    // Then
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contacts/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /categories/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument()
  })

  it('should render dashboard page by default', async () => {
    // When
    render(<App />)

    // Then
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
  })

  it('should render app layout with content area', () => {
    // When
    const { container } = render(<App />)

    // Then
    const main = container.querySelector('main')
    expect(main).toBeInTheDocument()
  })
})
