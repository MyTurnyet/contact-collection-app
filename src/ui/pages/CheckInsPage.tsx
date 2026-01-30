import { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  MenuItem,
  TextField,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useCheckIns } from '../hooks/useCheckIns'
import { useContacts } from '../hooks/useContacts'
import { CheckInCard } from '../components/CheckInCard'
import { CreateCheckInModal, type CreateCheckInFormData } from '../components/CreateCheckInModal'
import { CompleteCheckInModal } from '../components/CompleteCheckInModal'
import { RescheduleCheckInModal } from '../components/RescheduleCheckInModal'
import type { CheckIn } from '../../domain/checkin/CheckIn'
import { CheckInStatus } from '../../domain/checkin/CheckInStatus'
import { checkInIdFromString } from '../../domain/checkin/CheckInId'

type StatusFilter = 'all' | CheckInStatus
type SortOption = 'date' | 'contact' | 'status'

export function CheckInsPage() {
  const checkInsHook = useCheckIns()
  const contactsHook = useContacts()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [completingCheckIn, setCompletingCheckIn] = useState<CheckIn | null>(null)
  const [reschedulingCheckIn, setReschedulingCheckIn] = useState<CheckIn | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('date')

  const allCheckIns = useMemo(() => {
    return combineCheckInLists(checkInsHook)
  }, [checkInsHook.upcomingCheckIns, checkInsHook.overdueCheckIns])

  const filtered = useFilteredCheckIns(allCheckIns, statusFilter)
  const sorted = useSortedCheckIns(filtered, sortBy)

  if (checkInsHook.isLoading || contactsHook.isLoading) {
    return renderLoading()
  }

  if (checkInsHook.error) {
    return renderError(checkInsHook.error)
  }

  return (
    <Box sx={{ p: 3 }}>
      {renderHeader()}
      {renderControls()}
      {renderContent()}
      {renderModals()}
    </Box>
  )

  function renderHeader() {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Check-ins</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Check-in
        </Button>
      </Box>
    )
  }

  function renderControls() {
    return (
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value={CheckInStatus.Scheduled}>Upcoming</MenuItem>
          <MenuItem value={CheckInStatus.Overdue}>Overdue</MenuItem>
          <MenuItem value={CheckInStatus.Completed}>Completed</MenuItem>
        </TextField>
        <TextField
          select
          label="Sort by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="contact">Contact</MenuItem>
          <MenuItem value="status">Status</MenuItem>
        </TextField>
      </Box>
    )
  }

  function renderContent() {
    if (!sorted || sorted.length === 0) {
      return renderEmptyState()
    }
    return renderCheckInGrid()
  }

  function renderCheckInGrid() {
    return (
      <Grid container spacing={2}>
        {sorted?.map((checkIn) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={checkIn.id}>
            <CheckInCard
              checkIn={checkIn}
              contactName={getContactName(checkIn, contactsHook.contacts)}
              onComplete={setCompletingCheckIn}
              onReschedule={setReschedulingCheckIn}
            />
          </Grid>
        ))}
      </Grid>
    )
  }

  function renderEmptyState() {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No check-ins yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Get started by creating a check-in
        </Typography>
      </Box>
    )
  }

  function renderModals() {
    return (
      <>
        <CreateCheckInModal
          open={isCreateModalOpen}
          contacts={contactsHook.contacts || []}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreate}
        />
        {completingCheckIn && (
          <CompleteCheckInModal
            open
            checkIn={completingCheckIn}
            contactName={getContactName(completingCheckIn, contactsHook.contacts)}
            onClose={() => setCompletingCheckIn(null)}
            onComplete={handleComplete}
          />
        )}
        {reschedulingCheckIn && (
          <RescheduleCheckInModal
            open
            checkIn={reschedulingCheckIn}
            contactName={getContactName(reschedulingCheckIn, contactsHook.contacts)}
            onClose={() => setReschedulingCheckIn(null)}
            onReschedule={handleReschedule}
          />
        )}
      </>
    )
  }

  async function handleCreate(data: CreateCheckInFormData) {
    await checkInsHook.operations.createManual(data)
    setIsCreateModalOpen(false)
  }

  async function handleComplete(input: {
    checkInId: string
    completionDate: Date
    notes?: string
  }) {
    await checkInsHook.operations.complete({
      checkInId: checkInIdFromString(input.checkInId),
      completionDate: input.completionDate,
      notes: input.notes,
    })
    setCompletingCheckIn(null)
  }

  async function handleReschedule(input: {
    checkInId: string
    newScheduledDate: Date
  }) {
    await checkInsHook.operations.reschedule({
      checkInId: checkInIdFromString(input.checkInId),
      newScheduledDate: input.newScheduledDate,
    })
    setReschedulingCheckIn(null)
  }
}

function combineCheckInLists(checkInsHook: ReturnType<typeof useCheckIns>) {
  const upcoming = checkInsHook.upcomingCheckIns || []
  const overdue = checkInsHook.overdueCheckIns || []
  return [...upcoming, ...overdue]
}

function useFilteredCheckIns(
  checkIns: readonly CheckIn[],
  statusFilter: StatusFilter
) {
  return useMemo(() => {
    if (statusFilter === 'all') return checkIns
    return checkIns.filter((c) => c.status === statusFilter)
  }, [checkIns, statusFilter])
}

function useSortedCheckIns(
  checkIns: readonly CheckIn[],
  sortBy: SortOption
) {
  return useMemo(() => {
    const sorted = [...checkIns]
    if (sortBy === 'date') {
      return sorted.sort((a, b) =>
        a.scheduledDate.getTime() - b.scheduledDate.getTime()
      )
    }
    if (sortBy === 'status') {
      return sorted.sort((a, b) => a.status.localeCompare(b.status))
    }
    return sorted
  }, [checkIns, sortBy])
}

function getContactName(
  checkIn: CheckIn,
  contacts: readonly { id: string; name: string }[] | null
): string {
  if (!contacts) return 'Unknown'
  const contact = contacts.find((c) => c.id === checkIn.contactId)
  return contact?.name || 'Unknown'
}

function renderLoading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>Loading...</Typography>
    </Box>
  )
}

function renderError(error: Error) {
  return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error">{error.message}</Alert>
    </Box>
  )
}
