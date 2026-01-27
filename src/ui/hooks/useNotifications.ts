import { useState, useEffect, useCallback } from 'react'
import { useDependencies } from '../../di'

export interface UseNotificationsResult {
  permission: NotificationPermission
  isLoading: boolean
  error: Error | null
  requestPermission: () => Promise<void>
  sendNotification: (title: string, body: string) => Promise<void>
}

export function useNotifications(): UseNotificationsResult {
  const container = useDependencies()
  const notificationService = container.getNotificationService()

  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const checkPermission = useCallback(() => {
    try {
      const status = notificationService.getPermission()
      setPermission(status)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [notificationService])

  useEffect(() => {
    checkPermission()
  }, [checkPermission])

  const requestPermission = useCallback(async () => {
    try {
      setError(null)
      const status = await notificationService.requestPermission()
      setPermission(status)
    } catch (err) {
      setError(err as Error)
    }
  }, [notificationService])

  const sendNotification = useCallback(
    async (title: string, body: string) => {
      try {
        validateNotificationInput(title, body)
        setError(null)
        await notificationService.showNotification({ title, body })
      } catch (err) {
        setError(err as Error)
      }
    },
    [notificationService]
  )

  return {
    permission,
    isLoading,
    error,
    requestPermission,
    sendNotification,
  }
}

function validateNotificationInput(title: string, body: string): void {
  if (!title || title.trim() === '') {
    throw new Error('Notification title is required')
  }
  if (!body || body.trim() === '') {
    throw new Error('Notification body is required')
  }
}
