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

    expect(screen.getByText(getExpectedContactName())).toBeInTheDocument()

    const completeButtons = screen.getAllByRole('button', { name: /^complete$/i })
    await user.click(completeButtons[0])

    const dialog = await screen.findByRole('dialog', { name: /complete check-in/i })
    await user.click(within(dialog).getByRole('button', { name: /^complete$/i }))

    await waitFor(() => {
      expect(screen.getByText(getExpectedContactName())).toBeInTheDocument()
    })
  })

  it('should navigate to check-ins page and reschedule an overdue check-in', async () => {
    const user = userEvent.setup()

    const checkIn = await seedSingleOverdueCheckIn(container)

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

    const rescheduleButtons = screen.getAllByRole('button', { name: /reschedule/i })
    await user.click(rescheduleButtons[0])

    const dialog = await screen.findByRole('dialog', { name: /reschedule check-in/i })
    const dateInput = within(dialog).getByLabelText(/new date/i)
    const newDate = format(addDays(new Date(), 3), 'yyyy-MM-dd')
    await user.clear(dateInput)
    await user.type(dateInput, newDate)
    await user.click(within(dialog).getByRole('button', { name: /^reschedule$/i }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    const checkInRepo = container['checkInRepo']
    const rescheduled = await checkInRepo.findById(checkIn.id)
    expect(rescheduled?.scheduledDate).toEqual(new Date(newDate))
  })

  it('should create a manual check-in and verify it does not schedule next check-in', async () => {
    const user = userEvent.setup()

    await seedContact(container)

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

    expect(screen.getByText(/no check-ins yet/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /create check-in/i }))

    const createDialog = await screen.findByRole('dialog', { name: /create manual check-in/i })
    await user.click(within(createDialog).getByLabelText(/contact/i))
    await user.click(screen.getByText(getManualCheckInContactName()))

    const scheduledDate = format(addDays(new Date(), 5), 'yyyy-MM-dd')
    await user.type(within(createDialog).getByLabelText(/scheduled date/i), scheduledDate)
    await user.type(within(createDialog).getByLabelText(/notes/i), 'Manual check-in test')
    await user.click(within(createDialog).getByRole('button', { name: /^create$/i }))

    await waitFor(() => {
      expect(screen.getByText(getManualCheckInContactName())).toBeInTheDocument()
      expect(screen.getByText(/manual check-in test/i)).toBeInTheDocument()
    })

    const checkInRepo = container['checkInRepo']
    const allCheckIns = await checkInRepo.findAll()
    expect(allCheckIns.toArray().length).toBe(1)

    const manualCheckIn = allCheckIns.toArray()[0]

    const completeButtons = screen.getAllByRole('button', { name: /^complete$/i })
    await user.click(completeButtons[0])

    const completeDialog = await screen.findByRole('dialog', { name: /complete check-in/i })
    await user.click(within(completeDialog).getByRole('button', { name: /^complete$/i }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    const checkInsAfterComplete = await checkInRepo.findAll()
    expect(checkInsAfterComplete.toArray().length).toBe(2)

    const completed = await checkInRepo.findById(manualCheckIn.id)
    expect(completed?.status).toBe('Completed')
  }, 20000)
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

async function seedContact(container: DIContainer) {
  const createContact = container.getCreateContact()
  const contact = await createContact.execute({
    name: getManualCheckInContactName(),
    location: 'Test City',
    country: 'Test Country',
    timezone: 'UTC',
  })

  const createCategory = container.getCreateCategory()
  const category = await createCategory.execute({
    name: 'Test Category',
    frequencyValue: 2,
    frequencyUnit: 'weeks',
  })

  const assignContact = container.getAssignContactToCategory()
  await assignContact.execute({
    contactId: contact.id,
    categoryId: category.id,
  })

  return contact
}

function getExpectedContactName() {
  return 'Integration Test Contact'
}

function getManualCheckInContactName() {
  return 'Manual Check-in Test Contact'
}
