import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { DependencyProvider } from '../../di'
import { DIContainer } from '../../di/DIContainer'
import { DashboardPage } from '../../ui/pages/DashboardPage'
import { CheckInsPage } from '../../ui/pages/CheckInsPage'
import { addDays, subDays, format } from 'date-fns'

describe('Check-In Flow Integration', () => {
  let container: DIContainer

  beforeEach(() => {
    localStorage.clear()
    container = new DIContainer()
  })

  it('should navigate to check-ins page and complete an overdue check-in', async () => {
    const user = userEvent.setup()

    await seedSingleOverdueCheckIn(container)

    render(
      <DependencyProvider container={container}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/checkins" element={<CheckInsPage />} />
          </Routes>
        </MemoryRouter>
      </DependencyProvider>
    )

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /view all check-ins/i }))

    await waitFor(() => {
      expect(screen.getByText('Check-ins')).toBeInTheDocument()
    })

    expect(screen.getByText(/overdue check-ins/i)).toBeInTheDocument()
    expect(screen.getByText(getExpectedContactName())).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^complete$/i }))

    const dialog = await screen.findByRole('dialog', { name: /complete check-in/i })
    await user.click(within(dialog).getByRole('button', { name: /^complete$/i }))

    await waitFor(() => {
      expect(screen.getByText(/no overdue check-ins/i)).toBeInTheDocument()
    })
  })

  it('should navigate to check-ins page and reschedule an overdue check-in', async () => {
    const user = userEvent.setup()

    await seedSingleOverdueCheckIn(container)

    render(
      <DependencyProvider container={container}>
        <MemoryRouter initialEntries={['/checkins']}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/checkins" element={<CheckInsPage />} />
          </Routes>
        </MemoryRouter>
      </DependencyProvider>
    )

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /reschedule/i }))

    const dialog = await screen.findByRole('dialog', { name: /reschedule check-in/i })
    const dateInput = within(dialog).getByLabelText(/new date/i)
    const newDate = format(addDays(new Date(), 3), 'yyyy-MM-dd')
    await user.clear(dateInput)
    await user.type(dateInput, newDate)
    await user.click(within(dialog).getByRole('button', { name: /^reschedule$/i }))

    await waitFor(() => {
      expect(screen.getByText(/no overdue check-ins/i)).toBeInTheDocument()
    })
  })
})

async function seedSingleOverdueCheckIn(container: DIContainer) {
  const createContact = container.getCreateContact()
  const contact = await createContact.execute({
    name: getExpectedContactName(),
    location: 'Test City',
    country: 'Test Country',
    timezone: 'UTC',
  })

  const createCategory = container.getCreateCategory()
  const category = await createCategory.execute({
    name: 'Test Category',
    frequencyValue: 1,
    frequencyUnit: 'weeks',
  })

  const assignContact = container.getAssignContactToCategory()
  await assignContact.execute({
    contactId: contact.id,
    categoryId: category.id,
  })

  const scheduleCheckIn = container.getScheduleInitialCheckIn()
  const baseDate = subDays(new Date(), 8)
  return scheduleCheckIn.execute({ contactId: contact.id, baseDate })
}

function getExpectedContactName() {
  return 'Integration Test Contact'
}
