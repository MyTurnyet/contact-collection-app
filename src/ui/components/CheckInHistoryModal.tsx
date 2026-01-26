import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  Divider,
} from '@mui/material'
import { format } from 'date-fns'
import type { CheckIn } from '../../domain/checkin/CheckIn'
import { isNullCompletionDate } from '../../domain/checkin/CompletionDate'
import { isNullCheckInNotes } from '../../domain/checkin/CheckInNotes'

export interface CheckInHistoryModalProps {
  open: boolean
  contactName: string
  history: readonly CheckIn[]
  onClose: () => void
}

export function CheckInHistoryModal({
  open,
  contactName,
  history,
  onClose,
}: CheckInHistoryModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Check-in History - {contactName}</DialogTitle>
      <DialogContent>
        {renderContent(history)}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

function renderContent(history: readonly CheckIn[]) {
  if (history.length === 0) {
    return renderEmptyState()
  }
  return renderHistoryList(history)
}

function renderEmptyState() {
  return (
    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
      No check-in history available
    </Typography>
  )
}

function renderHistoryList(history: readonly CheckIn[]) {
  return (
    <List>
      {history.map((checkIn, index) => (
        <Box key={checkIn.id}>
          {renderHistoryItem(checkIn)}
          {index < history.length - 1 && <Divider />}
        </Box>
      ))}
    </List>
  )
}

function renderHistoryItem(checkIn: CheckIn) {
  return (
    <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
      <Typography variant="subtitle1">
        Scheduled: {format(checkIn.scheduledDate, 'MMM d, yyyy')}
      </Typography>
      {!isNullCompletionDate(checkIn.completionDate) && (
        <Typography variant="body2" color="text.secondary">
          Completed: {format(checkIn.completionDate, 'MMM d, yyyy')}
        </Typography>
      )}
      {!isNullCheckInNotes(checkIn.notes) && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          {checkIn.notes}
        </Typography>
      )}
    </ListItem>
  )
}
