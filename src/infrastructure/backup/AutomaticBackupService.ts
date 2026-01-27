import type { ExportService } from '../export/ExportService'

export type DownloadFunction = (filename: string, content: string) => void

export class AutomaticBackupService {
  readonly exporter: ExportService
  readonly downloadFn: DownloadFunction

  constructor(exporter: ExportService, downloadFn: DownloadFunction) {
    this.exporter = exporter
    this.downloadFn = downloadFn
  }

  async createBackup(): Promise<void> {
    const data = await this.exporter.export()
    const filename = this.generateFilename()
    const content = JSON.stringify(data, null, 2)
    this.downloadFn(filename, content)
  }

  private generateFilename(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = padZero(now.getMonth() + 1)
    const day = padZero(now.getDate())
    const hours = padZero(now.getHours())
    const minutes = padZero(now.getMinutes())
    const seconds = padZero(now.getSeconds())

    return `backup-${year}-${month}-${day}-${hours}${minutes}${seconds}.json`
  }
}

function padZero(num: number): string {
  return num.toString().padStart(2, '0')
}
