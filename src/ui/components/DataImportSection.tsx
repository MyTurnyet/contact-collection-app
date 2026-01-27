import { Box, Typography, Button, Alert } from '@mui/material'
import { Upload } from '@mui/icons-material'
import { type ChangeEvent } from 'react'

export interface DataImportSectionProps {
  onImport: (file: File) => void
  loading: boolean
  error: string | null
  success: boolean
}

export function DataImportSection({
  onImport,
  loading,
  error,
  success,
}: DataImportSectionProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Import Data
      </Typography>
      {renderFileInput(onImport, loading)}
      {renderMessages(error, success)}
    </Box>
  )
}

function renderFileInput(onImport: (file: File) => void, loading: boolean) {
  return (
    <Button variant="outlined" component="label" startIcon={<Upload />} disabled={loading}>
      Choose File
      <input
        type="file"
        hidden
        accept=".json"
        onChange={(e) => handleFileChange(e, onImport)}
        disabled={loading}
      />
    </Button>
  )
}

function handleFileChange(
  event: ChangeEvent<HTMLInputElement>,
  onImport: (file: File) => void
): void {
  const file = event.target.files?.[0]
  if (file) {
    onImport(file)
  }
}

function renderMessages(error: string | null, success: boolean) {
  return (
    <Box sx={{ mt: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Import successful!</Alert>}
    </Box>
  )
}
