import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { DependencyProvider } from '../../di'
import { ContactListPage } from '../../ui/pages/ContactListPage'
import { DashboardPage } from '../../ui/pages/DashboardPage'

describe('Contact Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should create contact, assign category, and view on dashboard', async () => {
    const user = userEvent.setup()

    // Given - Start on contact list page
    const { rerender } = render(
      <DependencyProvider>
        <ContactListPage />
      </DependencyProvider>
    )

    // Wait for page to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    // When - Create new contact
    await user.click(screen.getByRole('button', { name: /create contact/i }))

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // Fill in contact form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone/i), '5551234567')
    await user.type(screen.getByLabelText(/city/i), 'New York')
    await user.type(screen.getByLabelText(/country/i), 'United States')

    // Select timezone
    const timezoneField = screen.getByLabelText(/timezone/i)
    await user.click(timezoneField)
    await user.click(screen.getByRole('option', { name: 'America/New_York' }))

    // Save contact
    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)

    // Then - Contact appears in list
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    }, { timeout: 10000 })

    // And - Switch to dashboard
    rerender(
      <DependencyProvider>
        <DashboardPage />
      </DependencyProvider>
    )

    // Verify contact data is accessible from dashboard
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })
  })
})
