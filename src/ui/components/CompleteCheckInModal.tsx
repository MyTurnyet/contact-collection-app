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

export interface CompleteCheckInInput {
  checkInId: string
  completionDate: Date
  notes?: string
}

export interface CompleteCheckInModalProps {
  open: boolean
  checkIn: CheckIn
  contactName: string
  onClose: () => void
  onComplete: (input: CompleteCheckInInput) => void
}

export function CompleteCheckInModal({
  open,
  checkIn,
  contactName,
  onClose,
  onComplete,
}: CompleteCheckInModalProps) {
  const [notes, setNotes] = useState('')

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth key={checkIn.id}>
      <DialogTitle>Complete Check-in</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {renderContactInfo(contactName, checkIn.scheduledDate)}
          {renderNotesField(notes, setNotes)}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => handleComplete(checkIn.id, notes, onComplete)} variant="contained">
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

function handleComplete(
  checkInId: string,
  notes: string,
  onComplete: (input: CompleteCheckInInput) => void
): void {
  onComplete({
    checkInId,
    completionDate: new Date(),
    notes: notes.trim() || undefined,
  })
}
