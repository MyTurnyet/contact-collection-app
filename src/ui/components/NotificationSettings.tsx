import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Alert,
} from '@mui/material'

export interface NotificationSettingsProps {
  enabled: boolean
  permissionState: 'default' | 'granted' | 'denied'
  onPermissionRequest: () => void
  onToggle: () => void
}

export function NotificationSettings({
  enabled,
  permissionState,
  onPermissionRequest,
  onToggle,
}: NotificationSettingsProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Notification Settings
      </Typography>
      {renderPermissionContent(
        permissionState,
        enabled,
        onPermissionRequest,
        onToggle
      )}
    </Box>
  )
}

function renderPermissionContent(
  permissionState: 'default' | 'granted' | 'denied',
  enabled: boolean,
  onPermissionRequest: () => void,
  onToggle: () => void
) {
  if (permissionState === 'denied') {
    return renderDeniedMessage()
  }
  if (permissionState === 'default') {
    return renderRequestButton(onPermissionRequest)
  }
  return renderToggleSwitch(enabled, onToggle)
}

function renderDeniedMessage() {
  return (
    <Alert severity="warning">
      Permission denied. Please enable notifications in your browser settings.
    </Alert>
  )
}

function renderRequestButton(onPermissionRequest: () => void) {
  return (
    <Button variant="contained" onClick={onPermissionRequest}>
      Request Permission
    </Button>
  )
}

function renderToggleSwitch(enabled: boolean, onToggle: () => void) {
  return (
    <FormControlLabel
      control={<Switch checked={enabled} onChange={onToggle} />}
      label="Enable browser notifications"
    />
  )
}
