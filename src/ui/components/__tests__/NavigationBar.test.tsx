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
    const links = screen.getAllByRole('link', { name: /dashboard/i })
    expect(links.length).toBeGreaterThan(0)
  })

  it('should display contacts link', () => {
    // When
    renderWithRouter(<NavigationBar />)

    // Then
    const links = screen.getAllByRole('link', { name: /contacts/i })
    expect(links.length).toBeGreaterThan(0)
  })

  it('should display categories link', () => {
    // When
    renderWithRouter(<NavigationBar />)

    // Then
    const links = screen.getAllByRole('link', { name: /categories/i })
    expect(links.length).toBeGreaterThan(0)
  })

  it('should display check-ins link', () => {
    renderWithRouter(<NavigationBar />)

    const links = screen.getAllByRole('link', { name: /check-ins/i })
    expect(links.length).toBeGreaterThan(0)
  })

  it('should display settings link', () => {
    // When
    renderWithRouter(<NavigationBar />)

    // Then
    const links = screen.getAllByRole('link', { name: /settings/i })
    expect(links.length).toBeGreaterThan(0)
  })

  it('should have correct href for dashboard link', () => {
    // When
    renderWithRouter(<NavigationBar />)

    // Then
    const links = screen.getAllByRole('link', { name: /dashboard/i })
    expect(links[0]).toHaveAttribute('href', '/')
  })

  it('should have correct href for contacts link', () => {
    // When
    renderWithRouter(<NavigationBar />)

    // Then
    const links = screen.getAllByRole('link', { name: /contacts/i })
    expect(links[0]).toHaveAttribute('href', '/contacts')
  })

  it('should have correct href for categories link', () => {
    // When
    renderWithRouter(<NavigationBar />)

    // Then
    const links = screen.getAllByRole('link', { name: /categories/i })
    expect(links[0]).toHaveAttribute('href', '/categories')
  })

  it('should have correct href for check-ins link', () => {
    renderWithRouter(<NavigationBar />)

    const links = screen.getAllByRole('link', { name: /check-ins/i })
    expect(links[0]).toHaveAttribute('href', '/checkins')
  })

  it('should have correct href for settings link', () => {
    // When
    renderWithRouter(<NavigationBar />)

    // Then
    const links = screen.getAllByRole('link', { name: /settings/i })
    expect(links[0]).toHaveAttribute('href', '/settings')
  })
})
