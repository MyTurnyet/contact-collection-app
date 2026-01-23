import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText(/Contact Check-in App/i)).toBeInTheDocument()
  })

  it('renders with dependency injection', () => {
    render(<App />)
    expect(screen.getByText(/Dependency Injection Ready/i)).toBeInTheDocument()
  })
})
