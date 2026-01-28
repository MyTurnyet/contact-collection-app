import { useMemo, useState, useCallback } from 'react'
import { Box, Typography, CircularProgress, Alert, Grid } from '@mui/material'
import { useDashboard } from '../hooks/useDashboard'
import { useCheckIns } from '../hooks/useCheckIns'
import { useContacts } from '../hooks/useContacts'
import { OverdueCheckIns } from '../components/OverdueCheckIns'
import { UpcomingCheckIns } from '../components/UpcomingCheckIns'
import { TodayCheckIns } from '../components/TodayCheckIns'
import {
  CompleteCheckInModal,
  type CompleteCheckInInput as CompleteModalInput,
} from '../components/CompleteCheckInModal'
import {
  RescheduleCheckInModal,
  type RescheduleCheckInInput as RescheduleModalInput,
} from '../components/RescheduleCheckInModal'
import { checkInIdFromString } from '../../domain/checkin'
import type { CheckIn } from '../../domain/checkin/CheckIn'
import type { ContactId } from '../../domain/contact/ContactId'
import type { Contact } from '../../domain/contact/Contact'

export function CheckInsPage() {
  const dashboard = useDashboard()
  const checkIns = useCheckIns()
  const contacts = useContacts()
  const [completing, setCompleting] = useState<CheckIn | null>(null)
  const [rescheduling, setRescheduling] = useState<CheckIn | null>(null)

  const contactNames = useMemo(
    () => buildContactNamesMap(contacts.contacts),
    [contacts.contacts]
  )

  const handleComplete = useCallback(
    async (input: CompleteModalInput) => {
      await checkIns.operations.complete({
        checkInId: checkInIdFromString(input.checkInId),
        completionDate: input.completionDate,
        notes: input.notes,
      })
      setCompleting(null)
      await dashboard.operations.refresh()
    },
    [checkIns.operations, dashboard.operations]
  )

  const handleReschedule = useCallback(
    async (input: RescheduleModalInput) => {
      await checkIns.operations.reschedule({
        checkInId: checkInIdFromString(input.checkInId),
        newScheduledDate: input.newScheduledDate,
      })
      setRescheduling(null)
      await dashboard.operations.refresh()
    },
    [checkIns.operations, dashboard.operations]
  )

  if (isAnyLoading(dashboard, checkIns, contacts)) {
    return renderLoading()
  }

  if (hasAnyError(dashboard, checkIns, contacts)) {
    return renderError(getFirstError(dashboard, checkIns, contacts))
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Check-ins
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <OverdueCheckIns
            checkIns={checkIns.overdueCheckIns || []}
            contactNames={contactNames}
            onComplete={setCompleting}
            onReschedule={setRescheduling}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <UpcomingCheckIns
            checkIns={checkIns.upcomingCheckIns || []}
            contactNames={contactNames}
            onComplete={setCompleting}
            onReschedule={setRescheduling}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TodayCheckIns
            checkIns={dashboard.todayCheckIns || []}
            contactNames={contactNames}
            onComplete={setCompleting}
            onReschedule={setRescheduling}
          />
        </Grid>
      </Grid>

      {completing && (
        <CompleteCheckInModal
          open
          checkIn={completing}
          contactName={contactNames.get(completing.contactId) ?? 'Unknown'}
          onClose={() => setCompleting(null)}
          onComplete={handleComplete}
        />
      )}

      {rescheduling && (
        <RescheduleCheckInModal
          open
          checkIn={rescheduling}
          contactName={contactNames.get(rescheduling.contactId) ?? 'Unknown'}
          onClose={() => setRescheduling(null)}
          onReschedule={handleReschedule}
        />
      )}
    </Box>
  )
}

function buildContactNamesMap(
  contacts: readonly Contact[] | null
): Map<ContactId, string> {
  if (!contacts) return new Map()
  return new Map(contacts.map((c) => [c.id, c.name]))
}

function isAnyLoading(...results: Array<{ isLoading: boolean }>): boolean {
  return results.some((r) => r.isLoading)
}

function hasAnyError(...results: Array<{ error: Error | null }>): boolean {
  return results.some((r) => r.error !== null)
}

function getFirstError(...results: Array<{ error: Error | null }>): Error {
  const result = results.find((r) => r.error !== null)
  return result?.error ?? new Error('Unknown error')
}

function renderLoading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>Loading check-ins...</Typography>
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
