import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Alert,
} from '@mui/material'
import type { Contact } from '../../domain/contact/Contact'
import type { ContactId } from '../../domain/contact/ContactId'

export interface CreateCheckInFormData {
  contactId: ContactId
  scheduledDate: Date
  notes?: string
}

export interface CreateCheckInModalProps {
  open: boolean
  contacts: readonly Contact[]
  onClose: () => void
  onCreate: (data: CreateCheckInFormData) => void | Promise<void>
}

type FormErrors = Partial<Record<'contact' | 'scheduledDate', string>>

export function CreateCheckInModal({
  open,
  contacts,
  onClose,
  onCreate,
}: CreateCheckInModalProps) {
  const [contactId, setContactId] = useState<string>('')
  const [scheduledDate, setScheduledDate] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      resetForm()
    }
  }, [open])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Manual Check-in</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {renderContactDropdown(contactId, setContactId, contacts, errors)}
          {renderDateField(scheduledDate, setScheduledDate, errors)}
          {renderNotesField(notes, setNotes)}
        </Box>
      </DialogContent>
      <DialogActions>
        {renderActions(
          onClose,
          () => handleCreate(),
          isSaving
        )}
      </DialogActions>
    </Dialog>
  )

  function resetForm() {
    setContactId('')
    setScheduledDate('')
    setNotes('')
    setErrors({})
    setIsSaving(false)
  }

  async function handleCreate() {
    const validationErrors = validateForm(contactId, scheduledDate)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSaving(true)
    const selectedContact = findContactById(contactId, contacts)
    await onCreate({
      contactId: selectedContact!.id,
      scheduledDate: new Date(scheduledDate),
      notes: notes.trim() || undefined,
    })
    setIsSaving(false)
  }
}

function renderContactDropdown(
  contactId: string,
  setContactId: (id: string) => void,
  contacts: readonly Contact[],
  errors: FormErrors
) {
  return (
    <TextField
      select
      label="Contact"
      value={contactId}
      onChange={(e) => setContactId(e.target.value)}
      error={Boolean(errors.contact)}
      helperText={errors.contact}
      required
      fullWidth
    >
      {contacts.map((contact) => (
        <MenuItem key={contact.id} value={contact.id}>
          {contact.name}
        </MenuItem>
      ))}
    </TextField>
  )
}

function renderDateField(
  scheduledDate: string,
  setScheduledDate: (date: string) => void,
  errors: FormErrors
) {
  return (
    <TextField
      type="date"
      label="Scheduled Date"
      value={scheduledDate}
      onChange={(e) => setScheduledDate(e.target.value)}
      error={Boolean(errors.scheduledDate)}
      helperText={errors.scheduledDate}
      InputLabelProps={{ shrink: true }}
      required
      fullWidth
    />
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
      placeholder="Optional notes about this check-in..."
      fullWidth
    />
  )
}

function renderActions(
  onClose: () => void,
  onCreate: () => void,
  isSaving: boolean
) {
  return (
    <>
      <Button onClick={onClose} disabled={isSaving}>
        Cancel
      </Button>
      <Button onClick={onCreate} variant="contained" disabled={isSaving}>
        {isSaving ? 'Creating...' : 'Create'}
      </Button>
    </>
  )
}

function validateForm(contactId: string, scheduledDate: string): FormErrors {
  const errors: FormErrors = {}
  if (!contactId) {
    errors.contact = 'Contact is required'
  }
  if (!scheduledDate) {
    errors.scheduledDate = 'Scheduled date is required'
  }
  return errors
}

function findContactById(
  contactId: string,
  contacts: readonly Contact[]
): Contact | undefined {
  return contacts.find((c) => c.id === contactId)
}
