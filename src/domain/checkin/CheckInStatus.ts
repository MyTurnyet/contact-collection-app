export const CheckInStatus = {
  Scheduled: 'Scheduled',
  Completed: 'Completed',
  Overdue: 'Overdue',
} as const

export type CheckInStatus = (typeof CheckInStatus)[keyof typeof CheckInStatus]
