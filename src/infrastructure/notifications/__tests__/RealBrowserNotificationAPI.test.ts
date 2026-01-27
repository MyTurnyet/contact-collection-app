import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  RealBrowserNotificationAPI,
  type BrowserNotificationAPI,
} from '../BrowserNotificationService'

type FakeNotificationCtor = new (
  title: string,
  options?: {
    body?: string
    tag?: string
    icon?: string
  }
) => unknown

type NotificationGlobal = {
  Notification?: unknown
}

function getGlobal(): NotificationGlobal {
  return globalThis as unknown as NotificationGlobal
}

function setNotification(value: unknown): void {
  getGlobal().Notification = value
}

function getNotification(): unknown {
  return getGlobal().Notification
}

describe('RealBrowserNotificationAPI', () => {
  let originalNotification: unknown

  beforeEach(() => {
    originalNotification = getNotification()
  })

  afterEach(() => {
    setNotification(originalNotification)
  })

  it('should return denied when Notification API is not supported', async () => {
    setNotification(undefined)

    const api: BrowserNotificationAPI = new RealBrowserNotificationAPI()

    expect(api.isSupported()).toBe(false)
    expect(api.getPermission()).toBe('denied')
    await expect(api.requestPermission()).resolves.toBe('denied')
  })

  it('should request permission and map result when supported', async () => {
    const fakeRequestPermission = async () => 'granted' as const

    class FakeNotification {
      static permission = 'default' as const
      static requestPermission = fakeRequestPermission
    }

    setNotification(
      FakeNotification as unknown as FakeNotificationCtor & {
        permission: globalThis.NotificationPermission
        requestPermission: () => Promise<globalThis.NotificationPermission>
      }
    )

    const api = new RealBrowserNotificationAPI()

    expect(api.isSupported()).toBe(true)
    await expect(api.requestPermission()).resolves.toBe('granted')
  })

  it('should return mapped permission when supported', () => {
    class FakeNotification {
      static permission = 'granted' as const

      static requestPermission() {
        return Promise.resolve('granted' as const)
      }
    }

    setNotification(
      FakeNotification as unknown as FakeNotificationCtor & {
        permission: globalThis.NotificationPermission
        requestPermission: () => Promise<globalThis.NotificationPermission>
      }
    )

    const api = new RealBrowserNotificationAPI()
    expect(api.getPermission()).toBe('granted')
  })

  it('should create a browser notification with provided options', () => {
    const created: Array<{
      title: string
      body?: string
      tag?: string
      icon?: string
    }> = []

    class FakeNotification {
      static permission = 'granted' as const

      constructor(
        title: string,
        options: {
          body?: string
          tag?: string
          icon?: string
        }
      ) {
        created.push({ title, ...options })
      }

      static requestPermission() {
        return Promise.resolve('granted' as const)
      }
    }

    setNotification(
      FakeNotification as unknown as FakeNotificationCtor & {
        permission: globalThis.NotificationPermission
        requestPermission: () => Promise<globalThis.NotificationPermission>
      }
    )

    const api = new RealBrowserNotificationAPI()

    api.showNotification({
      title: 'Hello',
      body: 'World',
      tag: 'tag',
      icon: '/icon.png',
    })

    expect(created).toEqual([
      {
        title: 'Hello',
        body: 'World',
        tag: 'tag',
        icon: '/icon.png',
      },
    ])
  })
})
