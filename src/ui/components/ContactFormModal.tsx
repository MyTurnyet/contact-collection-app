import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
} from '@mui/material'
import type { Contact } from '../../domain/contact/Contact'
import {
  validatePhoneInput,
  validateEmailInput,
  validateLocationInput,
  getAvailableTimezones,
} from '../helpers/validation'

export interface ContactFormData {
  name: string
  phone: string
  email: string
  city: string
  state?: string
  country: string
  timezone: string
  relationshipContext?: string
}

export interface ContactFormModalProps {
  open: boolean
  contact?: Contact
  onClose: () => void
  onSave: (data: ContactFormData) => void
}

interface FormErrors {
  phone?: string
  email?: string
  location?: string
}

export function ContactFormModal({
  open,
  contact,
  onClose,
  onSave,
}: ContactFormModalProps) {
  const [formData, setFormData] = useState<ContactFormData>(
    getInitialFormData(contact)
  )
  const [errors, setErrors] = useState<FormErrors>({})

  const isEditMode = Boolean(contact)
  const title = isEditMode ? 'Edit Contact' : 'Create Contact'

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Phone"
            value={formData.phone}
            onChange={(e) => updatePhoneField(e.target.value)}
            onBlur={() => validatePhone()}
            error={Boolean(errors.phone)}
            helperText={errors.phone}
            required
            fullWidth
          />
          <TextField
            label="Email"
            value={formData.email}
            onChange={(e) => updateEmailField(e.target.value)}
            onBlur={() => validateEmail()}
            error={Boolean(errors.email)}
            helperText={errors.email}
            required
            fullWidth
          />
          <TextField
            label="City"
            value={formData.city}
            onChange={(e) => updateField('city', e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="State/Province"
            value={formData.state || ''}
            onChange={(e) => updateField('state', e.target.value)}
            fullWidth
          />
          <TextField
            label="Country"
            value={formData.country}
            onChange={(e) => updateField('country', e.target.value)}
            required
            fullWidth
          />
          <TextField
            select
            label="Timezone"
            value={formData.timezone}
            onChange={(e) => updateField('timezone', e.target.value)}
            required
            fullWidth
          >
            {getAvailableTimezones().map((tz) => (
              <MenuItem key={tz} value={tz}>
                {tz}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Relationship Context"
            value={formData.relationshipContext || ''}
            onChange={(e) => updateField('relationshipContext', e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )

  function updateField(field: keyof ContactFormData, value: string): void {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function updatePhoneField(value: string): void {
    updateField('phone', value)
    setErrors((prev) => ({ ...prev, phone: undefined }))
  }

  function updateEmailField(value: string): void {
    updateField('email', value)
    setErrors((prev) => ({ ...prev, email: undefined }))
  }

  function validatePhone(): void {
    const result = validatePhoneInput(formData.phone)
    if (!result.valid) {
      setErrors((prev) => ({ ...prev, phone: result.error }))
    }
  }

  function validateEmail(): void {
    const result = validateEmailInput(formData.email)
    if (!result.valid) {
      setErrors((prev) => ({ ...prev, email: result.error }))
    }
  }

  function handleSave(): void {
    const phoneValid = validatePhoneInput(formData.phone)
    const emailValid = validateEmailInput(formData.email)
    const locationValid = validateLocationInput({
      city: formData.city,
      country: formData.country,
      timezone: formData.timezone,
    })

    if (!phoneValid.valid || !emailValid.valid || !locationValid.valid) {
      setErrors({
        phone: phoneValid.error,
        email: emailValid.error,
        location: locationValid.error,
      })
      return
    }

    onSave(formData)
  }
}

function getInitialFormData(contact?: Contact): ContactFormData {
  if (contact) {
    return {
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      city: contact.location.city,
      state: contact.location.state,
      country: contact.location.country,
      timezone: contact.location.timezone,
      relationshipContext: contact.relationshipContext,
    }
  }
  return {
    name: '',
    phone: '',
    email: '',
    city: '',
    country: '',
    timezone: 'UTC',
  }
}
