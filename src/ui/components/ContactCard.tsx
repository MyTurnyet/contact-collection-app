import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import type { Contact } from '../../domain/contact/Contact'
import type { ContactId } from '../../domain/contact/ContactId'

export interface ContactCardProps {
  contact: Contact
  onEdit?: (contact: Contact) => void
  onDelete?: (id: ContactId) => void
  onView?: (contact: Contact) => void
}

export function ContactCard({
  contact,
  onEdit,
  onDelete,
  onView,
}: ContactCardProps) {
  return (
    <Card
      data-testid="contact-card"
      onClick={() => onView?.(contact)}
      sx={{ cursor: onView ? 'pointer' : 'default' }}
    >
      <CardContent>
        <Typography variant="h6" component="div">
          {contact.name}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {contact.phone}
        </Typography>
        <Typography color="text.secondary">
          {contact.email}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {formatLocation(contact)}
        </Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ ml: 'auto' }}>
          {onEdit && (
            <IconButton
              aria-label="edit"
              onClick={(e) => handleEdit(e, contact, onEdit)}
            >
              <EditIcon />
            </IconButton>
          )}
          {onDelete && (
            <IconButton
              aria-label="delete"
              onClick={(e) => handleDelete(e, contact.id, onDelete)}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </CardActions>
    </Card>
  )
}

function formatLocation(contact: Contact): string {
  return `${contact.location.city}, ${contact.location.country}`
}

function handleEdit(
  e: React.MouseEvent,
  contact: Contact,
  onEdit: (contact: Contact) => void
): void {
  e.stopPropagation()
  onEdit(contact)
}

function handleDelete(
  e: React.MouseEvent,
  id: ContactId,
  onDelete: (id: ContactId) => void
): void {
  e.stopPropagation()
  onDelete(id)
}
