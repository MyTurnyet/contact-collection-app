import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material'
import { format } from 'date-fns'
import type { CheckIn } from '../../domain/checkin/CheckIn'

export interface DeleteCheckInDialogProps {
  open: boolean
  checkIn: CheckIn | null
  contactName: string
  onClose: () => void
  onConfirm: () => void
}

export function DeleteCheckInDialog({
  open,
  checkIn,
  contactName,
  onClose,
  onConfirm,
}: DeleteCheckInDialogProps) {
  if (!checkIn) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Check-in?</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete this check-in?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          <strong>Contact:</strong> {contactName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Scheduled:</strong> {format(checkIn.scheduledDate, 'EEEE, MMMM d, yyyy')}
        </Typography>
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
