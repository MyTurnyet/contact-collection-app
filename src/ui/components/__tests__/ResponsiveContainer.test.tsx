import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResponsiveContainer } from '../ResponsiveContainer'

describe('ResponsiveContainer', () => {
  it('should render children', () => {
    // When
    render(
      <ResponsiveContainer>
        <div>Test Content</div>
      </ResponsiveContainer>
    )

    // Then
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should apply maxWidth lg', () => {
    // When
    const { container } = render(
      <ResponsiveContainer>
        <div>Test Content</div>
      </ResponsiveContainer>
    )

    // Then
    const containerElement = container.querySelector('.MuiContainer-root')
    expect(containerElement).toHaveClass('MuiContainer-maxWidthLg')
  })

  it('should accept additional props', () => {
    // When
    render(
      <ResponsiveContainer id="test-container">
        <div>Test Content</div>
      </ResponsiveContainer>
    )

    // Then
    expect(document.getElementById('test-container')).toBeInTheDocument()
  })

  it('should accept custom sx prop', () => {
    // When
    const { container } = render(
      <ResponsiveContainer sx={{ bgcolor: 'primary.main' }}>
        <div>Test Content</div>
      </ResponsiveContainer>
    )

    // Then
    const containerElement = container.querySelector('.MuiContainer-root')
    expect(containerElement).toBeInTheDocument()
  })
})
