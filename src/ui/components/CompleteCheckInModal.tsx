import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  Alert,
} from '@mui/material'
import { format, addDays, addWeeks, addMonths } from 'date-fns'
import type { CheckIn } from '../../domain/checkin/CheckIn'
import type { CheckInFrequency } from '../../domain/category/CheckInFrequency'

export interface CompleteCheckInInput {
  checkInId: string
  completionDate: Date
  notes?: string
  scheduleNext?: boolean
}

export interface CompleteCheckInModalProps {
  open: boolean
  checkIn: CheckIn
  contactName: string
  frequency?: CheckInFrequency
  onClose: () => void
  onComplete: (input: CompleteCheckInInput) => void
}

export function CompleteCheckInModal({
  open,
  checkIn,
  contactName,
  frequency,
  onClose,
  onComplete,
}: CompleteCheckInModalProps) {
  const [notes, setNotes] = useState('')
  const [scheduleNext, setScheduleNext] = useState(true)

  const nextDate = frequency ? calculateNextDate(checkIn.scheduledDate, frequency) : null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth key={checkIn.id}>
      <DialogTitle>Complete Check-in</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {renderContactInfo(contactName, checkIn.scheduledDate)}
          {renderNotesField(notes, setNotes)}
          {nextDate && renderScheduleNextOption(scheduleNext, setScheduleNext, nextDate)}
          {!frequency && renderNoFrequencyWarning()}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => handleComplete(checkIn.id, notes, scheduleNext, onComplete)}
          variant="contained"
        >
          Complete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function renderContactInfo(contactName: string, scheduledDate: Date) {
  return (
    <Box>
      <Typography variant="h6">{contactName}</Typography>
      <Typography color="text.secondary">
        Scheduled: {format(scheduledDate, 'MMM d, yyyy')}
      </Typography>
    </Box>
  )
}

function renderNotesField(notes: string, setNotes: (notes: string) => void) {
  return (
    <TextField
      label="Notes"
      multiline
      rows={4}
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      placeholder="Add notes about this check-in..."
      fullWidth
    />
  )
}

function renderScheduleNextOption(
  scheduleNext: boolean,
  setScheduleNext: (value: boolean) => void,
  nextDate: Date
) {
  return (
    <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={scheduleNext}
            onChange={(e) => setScheduleNext(e.target.checked)}
          />
        }
        label={
          <Box>
            <Typography variant="body1">
              Schedule next check-in
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {format(nextDate, 'EEEE, MMMM d, yyyy')}
            </Typography>
          </Box>
        }
      />
    </Box>
  )
}

function renderNoFrequencyWarning() {
  return (
    <Alert severity="info">
      No check-in frequency set for this contact's category. A follow-up check-in won't be automatically scheduled.
    </Alert>
  )
}

function calculateNextDate(scheduledDate: Date, frequency: CheckInFrequency): Date {
  const { value, unit } = frequency

  switch (unit) {
    case 'days':
      return addDays(scheduledDate, value)
    case 'weeks':
      return addWeeks(scheduledDate, value)
    case 'months':
      return addMonths(scheduledDate, value)
    default:
      return addDays(scheduledDate, 1)
  }
}

function handleComplete(
  checkInId: string,
  notes: string,
  scheduleNext: boolean,
  onComplete: (input: CompleteCheckInInput) => void
): void {
  onComplete({
    checkInId,
    completionDate: new Date(),
    notes: notes.trim() || undefined,
    scheduleNext,
  })
}
