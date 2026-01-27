export interface Migration {
  version: number
  up: () => Promise<void>
}
