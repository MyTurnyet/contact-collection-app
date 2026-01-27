export class BrowserDownloadService {
  download(filename: string, content: string): void {
    const blob = this.createBlob(content)
    const url = URL.createObjectURL(blob)
    this.triggerDownload(filename, url)
    URL.revokeObjectURL(url)
  }

  private createBlob(content: string): Blob {
    return new Blob([content], { type: 'application/json' })
  }

  private triggerDownload(filename: string, url: string): void {
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }
}
