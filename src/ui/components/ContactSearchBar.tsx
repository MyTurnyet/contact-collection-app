import { TextField, InputAdornment, IconButton } from '@mui/material'
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material'

export interface ContactSearchBarProps {
  value?: string
  onSearch: (query: string) => void
}

export function ContactSearchBar({ value = '', onSearch }: ContactSearchBarProps) {
  return (
    <TextField
      fullWidth
      placeholder="Search contacts..."
      value={value}
      onChange={(e) => onSearch(e.target.value)}
      InputProps={{
        startAdornment: createSearchIcon(),
        endAdornment: value && createClearButton(onSearch),
      }}
    />
  )
}

function createSearchIcon() {
  return (
    <InputAdornment position="start">
      <SearchIcon />
    </InputAdornment>
  )
}

function createClearButton(onSearch: (query: string) => void) {
  return (
    <InputAdornment position="end">
      <IconButton
        aria-label="clear"
        onClick={() => onSearch('')}
        edge="end"
      >
        <ClearIcon />
      </IconButton>
    </InputAdornment>
  )
}
