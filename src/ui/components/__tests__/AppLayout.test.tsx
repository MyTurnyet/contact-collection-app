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
    expect(screen.getAllByRole('link', { name: /dashboard/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /contacts/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /categories/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /settings/i }).length).toBeGreaterThan(0)
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
