import { Card, CardContent, CardActions, Button, Typography, Chip, Box } from '@mui/material'
import { format } from 'date-fns'
import type { CheckIn } from '../../domain/checkin/CheckIn'
import { CheckInStatus } from '../../domain/checkin/CheckInStatus'

export interface CheckInCardProps {
  checkIn: CheckIn
  contactName: string
  onComplete?: (checkIn: CheckIn) => void
  onReschedule?: (checkIn: CheckIn) => void
}

export function CheckInCard({
  checkIn,
  contactName,
  onComplete,
  onReschedule,
}: CheckInCardProps) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6">{contactName}</Typography>
          {renderStatusChip(checkIn.status)}
        </Box>
        <Typography color="text.secondary">
          {formatScheduledDate(checkIn.scheduledDate)}
        </Typography>
      </CardContent>
      {renderActions(checkIn, onComplete, onReschedule)}
    </Card>
  )
}

function renderStatusChip(status: CheckInStatus) {
  const color = getStatusColor(status)
  const label = getStatusLabel(status)
  return <Chip label={label} color={color} size="small" />
}

function getStatusColor(status: CheckInStatus): 'default' | 'error' | 'success' {
  if (status === CheckInStatus.Overdue) return 'error'
  if (status === CheckInStatus.Completed) return 'success'
  return 'default'
}

function getStatusLabel(status: CheckInStatus): string {
  if (status === CheckInStatus.Overdue) return 'Overdue'
  if (status === CheckInStatus.Completed) return 'Completed'
  return 'Scheduled'
}

function formatScheduledDate(date: Date): string {
  return `Scheduled: ${format(date, 'MMM d, yyyy')}`
}

function renderActions(
  checkIn: CheckIn,
  onComplete?: (checkIn: CheckIn) => void,
  onReschedule?: (checkIn: CheckIn) => void
) {
  if (!onComplete && !onReschedule) return null
  return (
    <CardActions>
      {onComplete && createCompleteButton(checkIn, onComplete)}
      {onReschedule && createRescheduleButton(checkIn, onReschedule)}
    </CardActions>
  )
}

function createCompleteButton(
  checkIn: CheckIn,
  onComplete: (checkIn: CheckIn) => void
) {
  return (
    <Button size="small" onClick={() => onComplete(checkIn)}>
      Complete
    </Button>
  )
}

function createRescheduleButton(
  checkIn: CheckIn,
  onReschedule: (checkIn: CheckIn) => void
) {
  return (
    <Button size="small" onClick={() => onReschedule(checkIn)}>
      Reschedule
    </Button>
  )
}
