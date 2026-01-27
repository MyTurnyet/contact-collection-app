import { Box, Typography, Button, Stack } from '@mui/material'
import { Download } from '@mui/icons-material'

export interface DataExportSectionProps {
  onExportJson: () => void
  onExportCsv: () => void
  loading: boolean
}

export function DataExportSection({
  onExportJson,
  onExportCsv,
  loading,
}: DataExportSectionProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Export Data
      </Typography>
      {renderExportButtons(onExportJson, onExportCsv, loading)}
    </Box>
  )
}

function renderExportButtons(
  onExportJson: () => void,
  onExportCsv: () => void,
  loading: boolean
) {
  return (
    <Stack direction="row" spacing={2}>
      <Button
        variant="outlined"
        startIcon={<Download />}
        onClick={onExportJson}
        disabled={loading}
      >
        Export as JSON
      </Button>
      <Button
        variant="outlined"
        startIcon={<Download />}
        onClick={onExportCsv}
        disabled={loading}
      >
        Export Contacts as CSV
      </Button>
    </Stack>
  )
}
