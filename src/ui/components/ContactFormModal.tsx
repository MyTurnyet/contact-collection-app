import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material'
import type { Contact } from '../../domain/contact/Contact'
import {
  validatePhoneInput,
  validateEmailInput,
  validateLocationInput,
  getAvailableTimezones,
} from '../helpers/validation'
import { useCategories } from '../hooks/useCategories'
import { isNullCategoryId } from '../../domain/category/CategoryId'
import { formatFrequency } from '../../domain/category/CheckInFrequency'
import type { Category } from '../../domain/category/Category'

export interface ContactFormData {
  name: string
  phone: string
  email: string
  city: string
  state?: string
  country: string
  timezone: string
  categoryId?: string
  relationshipContext?: string
}

export interface ContactFormModalProps {
  open: boolean
  contact?: Contact
  onClose: () => void
  onSave: (data: ContactFormData) => void | Promise<void>
}

type FormErrorField = 'name' | 'phone' | 'email' | 'city' | 'country' | 'timezone' | 'category'
type FormErrors = Partial<Record<FormErrorField, string>>

export function ContactFormModal({
  open,
  contact,
  onClose,
  onSave,
}: ContactFormModalProps) {
  const categoriesHook = useCategories()
  const [formData, setFormData] = useState<ContactFormData>(
    getInitialFormData(contact)
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData(contact))
      setErrors({})
      setSubmitError(null)
      setIsSaving(false)
    }
  }, [open, contact])

  const isEditMode = Boolean(contact)
  const title = isEditMode ? 'Edit Contact' : 'Create Contact'

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {submitError && <Alert severity="error">{submitError}</Alert>}
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            error={Boolean(errors.name)}
            helperText={errors.name}
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
            error={Boolean(errors.city)}
            helperText={errors.city}
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
            error={Boolean(errors.country)}
            helperText={errors.country}
            required
            fullWidth
          />
          <TextField
            select
            label="Timezone"
            value={formData.timezone}
            onChange={(e) => updateField('timezone', e.target.value)}
            error={Boolean(errors.timezone)}
            helperText={errors.timezone}
            required
            fullWidth
          >
            {getAvailableTimezones().map((tz) => (
              <MenuItem key={tz} value={tz}>
                {tz}
              </MenuItem>
            ))}
          </TextField>
          {renderCategoryField()}
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
        <Button onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={isSaving}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )

  function renderCategoryField() {
    if (categoriesHook.isLoading) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            Loading categories...
          </Typography>
        </Box>
      )
    }

    if (categoriesHook.error) {
      return (
        <Alert severity="error">
          Failed to load categories: {categoriesHook.error.message}
        </Alert>
      )
    }

    const categories = categoriesHook.categories || []

    if (categories.length === 0) {
      return (
        <Alert severity="info">
          No categories available. Please create a category first in the
          Categories page.
        </Alert>
      )
    }

    return (
      <TextField
        select
        label="Category"
        value={formData.categoryId || ''}
        onChange={(e) => updateCategoryField(e.target.value)}
        error={Boolean(errors.category)}
        helperText={errors.category}
        required={!isEditMode && categories.length > 0}
        fullWidth
      >
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {formatCategoryDisplay(category)}
          </MenuItem>
        ))}
      </TextField>
    )
  }

  function updateField(field: keyof ContactFormData, value: string): void {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (field === 'name' || field === 'city' || field === 'country' || field === 'timezone') {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function updateCategoryField(value: string): void {
    setFormData((prev) => ({ ...prev, categoryId: value }))
    setErrors((prev) => ({ ...prev, category: undefined }))
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

  async function handleSave(): Promise<void> {
    setSubmitError(null)

    const nextErrors: FormErrors = {}

    if (!formData.name || formData.name.trim().length === 0) {
      nextErrors.name = 'Name is required'
    }

    const phoneValid = validatePhoneInput(formData.phone)
    const emailValid = validateEmailInput(formData.email)
    const locationValid = validateLocationInput({
      city: formData.city,
      country: formData.country,
      timezone: formData.timezone,
    })

    if (!locationValid.valid) {
      if (!formData.city || formData.city.trim().length === 0) {
        nextErrors.city = 'City is required'
      }
      if (!formData.country || formData.country.trim().length === 0) {
        nextErrors.country = 'Country is required'
      }
      if (!formData.timezone || formData.timezone.trim().length === 0) {
        nextErrors.timezone = 'Timezone is required'
      }
    }

    if (!phoneValid.valid) {
      nextErrors.phone = phoneValid.error
    }

    if (!emailValid.valid) {
      nextErrors.email = emailValid.error
    }

    const hasCategories = categoriesHook.categories && categoriesHook.categories.length > 0
    if (!isEditMode && hasCategories && (!formData.categoryId || formData.categoryId.trim().length === 0)) {
      nextErrors.category = 'Category is required'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    try {
      setIsSaving(true)
      await onSave({
        ...formData,
        state: normalizeOptionalString(formData.state),
        categoryId: normalizeOptionalString(formData.categoryId),
        relationshipContext: normalizeOptionalString(formData.relationshipContext),
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save contact'
      setSubmitError(message)
    } finally {
      setIsSaving(false)
    }
  }
}

function formatCategoryDisplay(category: Category): string {
  return `${category.name} - ${formatFrequency(category.frequency)}`
}

function normalizeOptionalString(value?: string): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
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
      categoryId: isNullCategoryId(contact.categoryId) ? undefined : contact.categoryId,
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
