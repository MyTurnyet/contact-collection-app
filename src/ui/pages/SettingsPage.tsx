import { useState } from 'react'
import { Container, Typography, Box, Divider } from '@mui/material'
import { NotificationSettings } from '../components/NotificationSettings'
import { DataExportSection } from '../components/DataExportSection'
import { DataImportSection } from '../components/DataImportSection'
import { BackupSection } from '../components/BackupSection'
import { useDependencies } from '../../di'
import { useBackup } from '../hooks/useBackup'

export function SettingsPage() {
  const container = useDependencies()
  const backup = useBackup()
  const [notificationEnabled, setNotificationEnabled] = useState(false)
  const [permissionState, setPermissionState] = useState<
    'default' | 'granted' | 'denied'
  >('default')
  const [exportLoading, setExportLoading] = useState(false)
  const [importLoading, setImportLoading] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Box sx={{ my: 4 }}>
        <NotificationSettings
          enabled={notificationEnabled}
          permissionState={permissionState}
          onPermissionRequest={() => handlePermissionRequest(setPermissionState)}
          onToggle={() => handleToggle(notificationEnabled, setNotificationEnabled)}
        />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ my: 4 }}>
        <BackupSection onCreateBackup={() => backup.createBackup()} loading={backup.isCreating} />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ my: 4 }}>
        <DataExportSection
          onExportJson={() => handleExportJson(container, setExportLoading)}
          onExportCsv={() => handleExportCsv(container, setExportLoading)}
          loading={exportLoading}
        />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ my: 4 }}>
        <DataImportSection
          onImport={(file) =>
            handleImport(file, container, setImportLoading, setImportError, setImportSuccess)
          }
          loading={importLoading}
          error={importError}
          success={importSuccess}
        />
      </Box>
    </Container>
  )
}

function handlePermissionRequest(
  setPermissionState: (state: 'default' | 'granted' | 'denied') => void
): void {
  if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
      setPermissionState(permission as 'granted' | 'denied')
    })
  }
}

function handleToggle(
  enabled: boolean,
  setEnabled: (enabled: boolean) => void
): void {
  setEnabled(!enabled)
}

async function handleExportJson(
  container: ReturnType<typeof useDependencies>,
  setLoading: (loading: boolean) => void
): Promise<void> {
  setLoading(true)
  try {
    const exporter = container.getJsonExporter()
    const jsonString = await exporter.exportAsString()
    downloadFile(jsonString, 'backup.json', 'application/json')
  } finally {
    setLoading(false)
  }
}

async function handleExportCsv(
  container: ReturnType<typeof useDependencies>,
  setLoading: (loading: boolean) => void
): Promise<void> {
  setLoading(true)
  try {
    const exporter = container.getCsvExporter()
    const csvString = await exporter.exportContacts()
    downloadFile(csvString, 'contacts.csv', 'text/csv')
  } finally {
    setLoading(false)
  }
}

async function handleImport(
  file: File,
  container: ReturnType<typeof useDependencies>,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setSuccess: (success: boolean) => void
): Promise<void> {
  setLoading(true)
  setError(null)
  setSuccess(false)

  try {
    const text = await file.text()
    const importer = container.getJsonImporter()
    await importer.importFromString(text)
    setSuccess(true)
  } catch (error) {
    setError(getErrorMessage(error))
  } finally {
    setLoading(false)
  }
}

function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unknown error occurred'
}
