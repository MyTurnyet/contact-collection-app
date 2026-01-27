import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { NavigationBar } from '../NavigationBar'

describe('NavigationBar', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  it('should display app title', () => {
    // When
    renderWithRouter(<NavigationBar />)

    // Then
    expect(screen.getByText(/contact check-in/i)).toBeInTheDocument()
  })

  it('should display dashboard link', () => {
    // When
    renderWithRouter(<NavigationBar />)

    // Then
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
  })

  it('should display contacts link', () => {
    // When
    renderWithRouter(<NavigationBar />)

    // Then
    expect(screen.getByRole('link', { name: /contacts/i })).toBeInTheDocument()
  })

  it('should display categories link', () => {
    // When
    renderWithRouter(<NavigationBar />)

    // Then
    expect(screen.getByRole('link', { name: /categories/i })).toBeInTheDocument()
  })

  it('should display settings link', () => {
    // When
    renderWithRouter(<NavigationBar />)

    // Then
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument()
  })

  it('should have correct href for dashboard link', () => {
    // When
    renderWithRouter(<NavigationBar />)

    // Then
    const link = screen.getByRole('link', { name: /dashboard/i })
    expect(link).toHaveAttribute('href', '/')
  })

  it('should have correct href for contacts link', () => {
    // When
    renderWithRouter(<NavigationBar />)

    // Then
    const link = screen.getByRole('link', { name: /contacts/i })
    expect(link).toHaveAttribute('href', '/contacts')
  })

  it('should have correct href for categories link', () => {
    // When
    renderWithRouter(<NavigationBar />)

    // Then
    const link = screen.getByRole('link', { name: /categories/i })
    expect(link).toHaveAttribute('href', '/categories')
  })

  it('should have correct href for settings link', () => {
    // When
    renderWithRouter(<NavigationBar />)

    // Then
    const link = screen.getByRole('link', { name: /settings/i })
    expect(link).toHaveAttribute('href', '/settings')
  })
})
