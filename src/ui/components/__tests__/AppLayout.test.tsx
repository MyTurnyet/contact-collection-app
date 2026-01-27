import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AppLayout } from '../AppLayout'

describe('AppLayout', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  it('should render navigation bar', () => {
    // When
    renderWithRouter(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    )

    // Then
    expect(screen.getByText(/contact check-in/i)).toBeInTheDocument()
  })

  it('should render children content', () => {
    // When
    renderWithRouter(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    )

    // Then
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should render all navigation links', () => {
    // When
    renderWithRouter(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    )

    // Then
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contacts/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /categories/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument()
  })

  it('should apply proper spacing to content', () => {
    // When
    const { container } = renderWithRouter(
      <AppLayout>
        <div data-testid="content">Test Content</div>
      </AppLayout>
    )

    // Then
    const content = container.querySelector('[data-testid="content"]')
    expect(content).toBeInTheDocument()
  })
})
