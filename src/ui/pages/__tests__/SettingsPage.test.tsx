import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SettingsPage } from '../SettingsPage'
import { DependencyProvider } from '../../../di'
import { DIContainer } from '../../../di/DIContainer'

describe('SettingsPage', () => {
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

  it('should display page title', () => {
    // When
    render(<SettingsPage />, { wrapper })

    // Then
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('should display notification settings section', () => {
    // When
    render(<SettingsPage />, { wrapper })

    // Then
    expect(screen.getByText(/notification settings/i)).toBeInTheDocument()
  })

  it('should display export data section', () => {
    // When
    render(<SettingsPage />, { wrapper })

    // Then
    expect(screen.getByText(/export data/i)).toBeInTheDocument()
  })

  it('should display import data section', () => {
    // When
    render(<SettingsPage />, { wrapper })

    // Then
    expect(screen.getByText(/import data/i)).toBeInTheDocument()
  })

  it('should show export buttons', () => {
    // When
    render(<SettingsPage />, { wrapper })

    // Then
    expect(screen.getByRole('button', { name: /export as json/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /export contacts as csv/i })).toBeInTheDocument()
  })

  it('should show import file input', () => {
    // When
    render(<SettingsPage />, { wrapper })

    // Then
    expect(screen.getByLabelText(/choose file/i)).toBeInTheDocument()
  })
})
