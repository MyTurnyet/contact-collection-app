import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
} from '@mui/material'
import type { Contact } from '../../domain/contact/Contact'

export interface ContactDetailModalProps {
  open: boolean
  contact: Contact
  onClose: () => void
  onEdit?: (contact: Contact) => void
}

export function ContactDetailModal({
  open,
  contact,
  onClose,
  onEdit,
}: ContactDetailModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{contact.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <DetailSection label="Phone" value={contact.phone} />
          <DetailSection label="Email" value={contact.email} />
          <DetailSection label="Location" value={formatLocation(contact)} />
          <DetailSection label="Timezone" value={contact.location.timezone} />
          {contact.relationshipContext && (
            <DetailSection
              label="Relationship"
              value={contact.relationshipContext}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        {onEdit && (
          <Button onClick={() => onEdit(contact)} variant="outlined">
            Edit
          </Button>
        )}
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

interface DetailSectionProps {
  label: string
  value: string
}

function DetailSection({ label, value }: DetailSectionProps) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
      <Divider sx={{ mt: 1 }} />
    </Box>
  )
}

function formatLocation(contact: Contact): string {
  const parts = [
    contact.location.city,
    contact.location.state,
    contact.location.country,
  ].filter(Boolean)
  return parts.join(', ')
}
