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
} from '@mui/material'
import { format } from 'date-fns'
import type { CheckIn } from '../../domain/checkin/CheckIn'

export interface RescheduleCheckInInput {
  checkInId: string
  newScheduledDate: Date
}

export interface RescheduleCheckInModalProps {
  open: boolean
  checkIn: CheckIn
  contactName: string
  onClose: () => void
  onReschedule: (input: RescheduleCheckInInput) => void
}

interface FormState {
  newDate: string
  error: string
}

export function RescheduleCheckInModal({
  open,
  checkIn,
  contactName,
  onClose,
  onReschedule,
}: RescheduleCheckInModalProps) {
  const [formState, setFormState] = useState<FormState>({
    newDate: '',
    error: '',
  })

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth key={checkIn.id}>
      <DialogTitle>Reschedule Check-in</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {renderContactInfo(contactName, checkIn.scheduledDate)}
          {renderDatePicker(formState, setFormState)}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => handleReschedule(checkIn.id, formState, setFormState, onReschedule)} variant="contained">
          Reschedule
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
        Currently scheduled: {format(scheduledDate, 'MMM d, yyyy')}
      </Typography>
    </Box>
  )
}

function renderDatePicker(
  formState: FormState,
  setFormState: (state: FormState) => void
) {
  return (
    <TextField
      label="New Date"
      type="date"
      value={formState.newDate}
      onChange={(e) => handleDateChange(e.target.value, setFormState)}
      error={Boolean(formState.error)}
      helperText={formState.error}
      InputLabelProps={{ shrink: true }}
      fullWidth
    />
  )
}

function handleDateChange(
  newDate: string,
  setFormState: (state: FormState) => void
): void {
  setFormState({ newDate, error: '' })
}

function handleReschedule(
  checkInId: string,
  formState: FormState,
  setFormState: (state: FormState) => void,
  onReschedule: (input: RescheduleCheckInInput) => void
): void {
  if (!formState.newDate) {
    setFormState({ ...formState, error: 'New date is required' })
    return
  }

  onReschedule({
    checkInId,
    newScheduledDate: new Date(formState.newDate),
  })
}
