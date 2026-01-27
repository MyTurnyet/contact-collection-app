import { Box, Button, Typography, CircularProgress } from '@mui/material'
import BackupIcon from '@mui/icons-material/Backup'

export interface BackupSectionProps {
  onCreateBackup: () => void
  loading: boolean
}

export function BackupSection({ onCreateBackup, loading }: BackupSectionProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Automatic Backups
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Create a backup of all your data. Backups are downloaded as JSON files.
      </Typography>
      <Button
        variant="contained"
        startIcon={loading ? <CircularProgress size={20} /> : <BackupIcon />}
        onClick={onCreateBackup}
        disabled={loading}
      >
        {loading ? 'Creating Backup...' : 'Create Backup Now'}
      </Button>
    </Box>
  )
}
