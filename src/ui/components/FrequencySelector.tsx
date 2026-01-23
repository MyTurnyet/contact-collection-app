import { Box, TextField, MenuItem } from '@mui/material'
import type { FrequencyUnit } from '../../domain/category/CheckInFrequency'

export interface FrequencySelectorProps {
  value: number
  unit: FrequencyUnit
  onValueChange: (value: number) => void
  onUnitChange: (unit: FrequencyUnit) => void
}

const FREQUENCY_UNITS: FrequencyUnit[] = ['days', 'weeks', 'months']

export function FrequencySelector({
  value,
  unit,
  onValueChange,
  onUnitChange,
}: FrequencySelectorProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextField
        label="Frequency Value"
        type="number"
        value={value}
        onChange={handleValueChange}
        inputProps={{ min: 1, max: 365 }}
        sx={{ flex: 1 }}
      />
      <TextField
        select
        label="Frequency Unit"
        value={unit}
        onChange={handleUnitChange}
        sx={{ flex: 1 }}
      >
        {FREQUENCY_UNITS.map(createUnitOption)}
      </TextField>
    </Box>
  )

  function handleValueChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const numValue = parseInt(e.target.value, 10)
    if (!isNaN(numValue)) {
      onValueChange(numValue)
    }
  }

  function handleUnitChange(e: React.ChangeEvent<HTMLInputElement>): void {
    onUnitChange(e.target.value as FrequencyUnit)
  }
}

function createUnitOption(unitValue: FrequencyUnit) {
  return (
    <MenuItem key={unitValue} value={unitValue}>
      {unitValue}
    </MenuItem>
  )
}
