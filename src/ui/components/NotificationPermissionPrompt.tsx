import { Alert, Button, Box } from '@mui/material'
import { NotificationsActive as NotificationsIcon } from '@mui/icons-material'

export interface NotificationPermissionPromptProps {
  permission: NotificationPermission
  onRequestPermission: () => void
  onDismiss: () => void
}

export function NotificationPermissionPrompt({
  permission,
  onRequestPermission,
  onDismiss,
}: NotificationPermissionPromptProps) {
  if (shouldHidePrompt(permission)) {
    return null
  }

  return (
    <Alert severity="info" icon={<NotificationsIcon />} sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {renderMessage()}
        {renderActions(onRequestPermission, onDismiss)}
      </Box>
    </Alert>
  )
}

function shouldHidePrompt(permission: NotificationPermission): boolean {
  return permission !== 'default'
}

function renderMessage() {
  return (
    <Box>
      <strong>Enable Notifications</strong>
      <br />
      Stay on top of your check-ins with timely reminders
    </Box>
  )
}

function renderActions(onRequestPermission: () => void, onDismiss: () => void) {
  return (
    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
      <Button size="small" variant="contained" onClick={onRequestPermission}>
        Enable
      </Button>
      <Button size="small" onClick={onDismiss}>
        Later
      </Button>
    </Box>
  )
}
