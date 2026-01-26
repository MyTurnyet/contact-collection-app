import { Grid, Card, CardContent, Typography } from '@mui/material'
import type { DashboardSummary } from '../../application/dashboard/DashboardSummary'

export interface DashboardStatsProps {
  summary: DashboardSummary
}

export function DashboardStats({ summary }: DashboardStatsProps) {
  return (
    <Grid container spacing={3}>
      {renderOverdueStat(summary.overdueCount)}
      {renderUpcomingStat(summary.upcomingCount)}
      {renderTotalContactsStat(summary.totalContacts)}
    </Grid>
  )
}

function renderOverdueStat(count: number) {
  return renderStatCard('Overdue', count, 'error.main')
}

function renderUpcomingStat(count: number) {
  return renderStatCard('Upcoming', count, 'primary.main')
}

function renderTotalContactsStat(count: number) {
  return renderStatCard('Total Contacts', count, 'text.secondary')
}

function renderStatCard(label: string, value: number, color: string) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Card data-testid="stat-card">
        <CardContent>
          <Typography color="text.secondary" gutterBottom>
            {label}
          </Typography>
          <Typography variant="h3" sx={{ color }}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}
