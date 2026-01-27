import { useMemo, useEffect, useState, useCallback } from 'react'
import { Box, Typography, CircularProgress, Alert, Grid } from '@mui/material'
import { useDashboard } from '../hooks/useDashboard'
import { useCheckIns } from '../hooks/useCheckIns'
import { useContacts } from '../hooks/useContacts'
import { useNotifications } from '../hooks/useNotifications'
import { DashboardStats } from '../components/DashboardStats'
import { OverdueCheckIns } from '../components/OverdueCheckIns'
import { UpcomingCheckIns } from '../components/UpcomingCheckIns'
import { TodayCheckIns } from '../components/TodayCheckIns'
import { NotificationPermissionPrompt } from '../components/NotificationPermissionPrompt'
import type { ContactId } from '../../domain/contact/ContactId'
import type { Contact } from '../../domain/contact/Contact'
import type { DashboardSummary } from '../../application/dashboard/DashboardSummary'

export function DashboardPage() {
  const dashboard = useDashboard()
  const checkIns = useCheckIns()
  const contacts = useContacts()
  const notifications = useNotifications()
  const [promptDismissed, setPromptDismissed] = useState(false)

  const contactNames = useMemo(
    () => buildContactNamesMap(contacts.contacts),
    [contacts.contacts]
  )

  const sendNotificationsForCheckIns = useCallback(async () => {
    if (notifications.permission !== 'granted') return

    const overdueCount = checkIns.overdueCheckIns?.length || 0
    const todayCount = dashboard.todayCheckIns?.length || 0

    if (overdueCount > 0) {
      await notifications.sendNotification(
        'Overdue Check-ins',
        `You have ${overdueCount} overdue check-in${overdueCount > 1 ? 's' : ''}`
      )
    }

    if (todayCount > 0) {
      await notifications.sendNotification(
        'Check-ins Due Today',
        `You have ${todayCount} check-in${todayCount > 1 ? 's' : ''} due today`
      )
    }
  }, [notifications, checkIns.overdueCheckIns, dashboard.todayCheckIns])

  useEffect(() => {
    sendNotificationsForCheckIns()
  }, [sendNotificationsForCheckIns])

  if (isAnyLoading(dashboard, checkIns, contacts)) {
    return renderLoading()
  }

  if (hasAnyError(dashboard, checkIns, contacts)) {
    return renderError(getFirstError(dashboard, checkIns, contacts))
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {!promptDismissed && (
        <NotificationPermissionPrompt
          permission={notifications.permission}
          onRequestPermission={notifications.requestPermission}
          onDismiss={() => setPromptDismissed(true)}
        />
      )}

      <Box sx={{ mb: 4 }}>
        <DashboardStats summary={getSummaryOrDefault(dashboard.summary)} />
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <OverdueCheckIns
            checkIns={checkIns.overdueCheckIns || []}
            contactNames={contactNames}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <UpcomingCheckIns
            checkIns={checkIns.upcomingCheckIns || []}
            contactNames={contactNames}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TodayCheckIns
            checkIns={dashboard.todayCheckIns || []}
            contactNames={contactNames}
          />
        </Grid>
      </Grid>
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
      <Typography sx={{ ml: 2 }}>Loading dashboard...</Typography>
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

function getSummaryOrDefault(summary: DashboardSummary | null): DashboardSummary {
  return summary ?? createEmptySummary()
}

function createEmptySummary(): DashboardSummary {
  return {
    overdueCount: 0,
    upcomingCount: 0,
    totalContacts: 0,
    contactsByCategory: new Map(),
  }
}
