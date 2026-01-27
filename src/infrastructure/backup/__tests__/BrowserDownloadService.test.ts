import { describe, it, expect, beforeEach, vi } from 'vitest'
import { BrowserDownloadService } from '../BrowserDownloadService'

describe('BrowserDownloadService', () => {
  let mockAnchor: HTMLAnchorElement

  beforeEach(() => {
    mockAnchor = {
      href: '',
      download: '',
      click: vi.fn(),
      remove: vi.fn(),
    } as unknown as HTMLAnchorElement

    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor)
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockAnchor)
  })

  it('should create download link with filename', () => {
    // Given
    const service = new BrowserDownloadService()

    // When
    service.download('test.json', '{}')

    // Then
    expect(mockAnchor.download).toBe('test.json')
  })

  it('should create blob URL from content', () => {
    // Given
    const service = new BrowserDownloadService()
    const content = '{"test": "data"}'

    // When
    service.download('test.json', content)

    // Then
    expect(mockAnchor.href).toContain('blob:')
  })

  it('should trigger download', () => {
    // Given
    const service = new BrowserDownloadService()

    // When
    service.download('test.json', '{}')

    // Then
    expect(mockAnchor.click).toHaveBeenCalledOnce()
  })

  it('should clean up anchor element', () => {
    // Given
    const service = new BrowserDownloadService()

    // When
    service.download('test.json', '{}')

    // Then
    expect(mockAnchor.remove).toHaveBeenCalledOnce()
  })

  it('should append anchor to body', () => {
    // Given
    const service = new BrowserDownloadService()

    // When
    service.download('test.json', '{}')

    // Then
    expect(document.body.appendChild).toHaveBeenCalledWith(mockAnchor)
  })
})
