import { describe, it, expect } from 'vitest'
import { theme } from '../theme'

describe('theme', () => {
  it('should have cyan primary color', () => {
    // Then
    expect(theme.palette.primary.main).toBe('#0891b2')
  })

  it('should have violet secondary color', () => {
    // Then
    expect(theme.palette.secondary.main).toBe('#7c3aed')
  })

  it('should have emerald success color', () => {
    // Then
    expect(theme.palette.success.main).toBe('#059669')
  })

  it('should have amber warning color', () => {
    // Then
    expect(theme.palette.warning.main).toBe('#f59e0b')
  })

  it('should have red error color', () => {
    // Then
    expect(theme.palette.error.main).toBe('#dc2626')
  })

  it('should use system font stack', () => {
    // Then
    expect(theme.typography.fontFamily).toContain('Roboto')
    expect(theme.typography.fontFamily).toContain('-apple-system')
  })

  it('should disable text transform on buttons', () => {
    // Then
    expect(theme.components?.MuiButton?.styleOverrides?.root).toHaveProperty(
      'textTransform',
      'none'
    )
  })
})
