import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormHelperText,
} from '@mui/material'
import type { Category } from '../../domain/category/Category'
import type { FrequencyUnit } from '../../domain/category/CheckInFrequency'
import { FrequencySelector } from './FrequencySelector'

export interface CategoryFormData {
  name: string
  frequencyValue: number
  frequencyUnit: FrequencyUnit
}

export interface CategoryFormModalProps {
  open: boolean
  category?: Category
  onClose: () => void
  onSave: (data: CategoryFormData) => void
}

interface FormErrors {
  name?: string
  frequency?: string
}

export function CategoryFormModal({
  open,
  category,
  onClose,
  onSave,
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>(
    getInitialFormData(category)
  )
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData(category))
      setErrors({})
    }
  }, [open, category])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{category ? 'Edit Category' : 'Create Category'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={formData.name}
            onChange={handleNameChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
            fullWidth
          />
          <Box>
            <FrequencySelector
              value={formData.frequencyValue}
              unit={formData.frequencyUnit}
              onValueChange={handleFrequencyValueChange}
              onUnitChange={handleFrequencyUnitChange}
            />
            {errors.frequency && (
              <FormHelperText error>{errors.frequency}</FormHelperText>
            )}
          </Box>
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

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setFormData({ ...formData, name: e.target.value })
    if (errors.name) {
      setErrors({ ...errors, name: undefined })
    }
  }

  function handleFrequencyValueChange(value: number): void {
    setFormData({ ...formData, frequencyValue: value })
    if (errors.frequency) {
      setErrors({ ...errors, frequency: undefined })
    }
  }

  function handleFrequencyUnitChange(unit: FrequencyUnit): void {
    setFormData({ ...formData, frequencyUnit: unit })
  }

  function handleSave(): void {
    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    onSave(formData)
  }
}

function getInitialFormData(category?: Category): CategoryFormData {
  if (category) {
    return {
      name: category.name,
      frequencyValue: category.frequency.value,
      frequencyUnit: category.frequency.unit,
    }
  }
  return {
    name: '',
    frequencyValue: 1,
    frequencyUnit: 'days',
  }
}

function validateForm(data: CategoryFormData): FormErrors {
  const errors: FormErrors = {}
  validateName(data.name, errors)
  validateFrequencyValue(data.frequencyValue, errors)
  return errors
}

function validateName(name: string, errors: FormErrors): void {
  if (!name.trim()) {
    errors.name = 'Name is required'
  }
}

function validateFrequencyValue(value: number, errors: FormErrors): void {
  if (value <= 0) {
    errors.frequency = 'Frequency value must be greater than 0'
  } else if (!Number.isInteger(value)) {
    errors.frequency = 'Frequency value must be a whole number'
  } else if (value > 365) {
    errors.frequency = 'Frequency value cannot exceed 365'
  }
}
