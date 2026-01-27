import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { NotFoundPage } from '../NotFoundPage'

describe('NotFoundPage', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  it('should display 404 message', () => {
    // When
    renderWithRouter(<NotFoundPage />)

    // Then
    expect(screen.getByText(/404/i)).toBeInTheDocument()
  })

  it('should display page not found message', () => {
    // When
    renderWithRouter(<NotFoundPage />)

    // Then
    expect(screen.getByText(/page not found/i)).toBeInTheDocument()
  })

  it('should display link to dashboard', () => {
    // When
    renderWithRouter(<NotFoundPage />)

    // Then
    expect(screen.getByRole('link', { name: /go to dashboard/i })).toBeInTheDocument()
  })

  it('should have correct href for dashboard link', () => {
    // When
    renderWithRouter(<NotFoundPage />)

    // Then
    const link = screen.getByRole('link', { name: /go to dashboard/i })
    expect(link).toHaveAttribute('href', '/')
  })
})
