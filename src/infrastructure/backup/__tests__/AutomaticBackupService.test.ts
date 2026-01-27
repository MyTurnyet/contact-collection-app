import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AutomaticBackupService } from '../AutomaticBackupService'
import type { ExportService } from '../../export/ExportService'

describe('AutomaticBackupService', () => {
  let exporter: ExportService
  let downloadFn: (filename: string, content: string) => void

  beforeEach(() => {
    exporter = {
      export: vi.fn().mockResolvedValue({ contacts: [], categories: [], checkIns: [] }),
      exportAsString: vi.fn().mockResolvedValue('{}'),
    }
    downloadFn = vi.fn()
  })

  it('should create backup with timestamp', async () => {
    // Given
    const service = new AutomaticBackupService(exporter, downloadFn)

    // When
    await service.createBackup()

    // Then
    expect(downloadFn).toHaveBeenCalled()
    const calls = vi.mocked(downloadFn).mock.calls
    const filename = calls[0][0]
    expect(filename).toMatch(/^backup-\d{4}-\d{2}-\d{2}-\d{6}\.json$/)
  })

  it('should export data when creating backup', async () => {
    // Given
    const service = new AutomaticBackupService(exporter, downloadFn)

    // When
    await service.createBackup()

    // Then
    expect(exporter.export).toHaveBeenCalledOnce()
  })

  it('should download exported data', async () => {
    // Given
    const exportData = { contacts: [{ id: '1' }], categories: [], checkIns: [] }
    exporter.export = vi.fn().mockResolvedValue(exportData)
    const service = new AutomaticBackupService(exporter, downloadFn)

    // When
    await service.createBackup()

    // Then
    expect(downloadFn).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify(exportData, null, 2)
    )
  })

  it('should format filename with readable timestamp', async () => {
    // Given
    const service = new AutomaticBackupService(exporter, downloadFn)
    const testDate = new Date('2026-01-27T14:30:45')
    vi.setSystemTime(testDate)

    // When
    await service.createBackup()

    // Then
    const calls = vi.mocked(downloadFn).mock.calls
    const filename = calls[0][0]
    expect(filename).toBe('backup-2026-01-27-143045.json')
  })

  it('should handle export errors gracefully', async () => {
    // Given
    exporter.export = vi.fn().mockRejectedValue(new Error('Export failed'))
    const service = new AutomaticBackupService(exporter, downloadFn)

    // When/Then
    await expect(service.createBackup()).rejects.toThrow('Export failed')
    expect(downloadFn).not.toHaveBeenCalled()
  })

  it('should create backup on demand', async () => {
    // Given
    const service = new AutomaticBackupService(exporter, downloadFn)

    // When
    await service.createBackup()

    // Then
    expect(exporter.export).toHaveBeenCalledOnce()
    expect(downloadFn).toHaveBeenCalled()
  })
})
