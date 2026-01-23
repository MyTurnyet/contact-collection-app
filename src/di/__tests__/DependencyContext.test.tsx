import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useEffect } from 'react'
import { DependencyProvider } from '../DependencyContext'
import { useDependencies } from '../useDependencies'
import { DIContainer } from '../DIContainer'

// Test component that uses the dependencies hook
function TestComponent() {
  const container = useDependencies()
  const createContact = container.getCreateContact()

  return (
    <div data-testid="test-component">
      {createContact ? 'Dependencies Available' : 'No Dependencies'}
    </div>
  )
}

// Test component that verifies specific use case
function ContactUseCaseComponent() {
  const container = useDependencies()
  const createContact = container.getCreateContact()
  const updateContact = container.getUpdateContact()

  return (
    <div data-testid="use-case-component">
      {createContact && updateContact ? 'Use Cases Available' : 'Missing'}
    </div>
  )
}

describe('DependencyContext', () => {
  describe('DependencyProvider', () => {
    it('should provide dependencies to child components', () => {
      // When
      render(
        <DependencyProvider>
          <TestComponent />
        </DependencyProvider>
      )

      // Then
      expect(screen.getByTestId('test-component')).toHaveTextContent(
        'Dependencies Available'
      )
    })

    it('should provide access to use cases', () => {
      // When
      render(
        <DependencyProvider>
          <ContactUseCaseComponent />
        </DependencyProvider>
      )

      // Then
      expect(screen.getByTestId('use-case-component')).toHaveTextContent(
        'Use Cases Available'
      )
    })

    it('should accept custom container', () => {
      // Given
      const customContainer = new DIContainer()

      // When
      render(
        <DependencyProvider container={customContainer}>
          <TestComponent />
        </DependencyProvider>
      )

      // Then
      expect(screen.getByTestId('test-component')).toHaveTextContent(
        'Dependencies Available'
      )
    })
  })

  describe('useDependencies', () => {
    it('should throw error when used outside provider', () => {
      // Given
      function ComponentOutsideProvider() {
        useDependencies()
        return <div>Should not render</div>
      }

      // When/Then
      expect(() => render(<ComponentOutsideProvider />)).toThrow(
        'useDependencies must be used within a DependencyProvider'
      )
    })

    it('should return DIContainer instance', () => {
      // Given
      const capturedContainerRef: { current: DIContainer | null } = { current: null }

      function CaptureContainer() {
        const container = useDependencies()
        useEffect(() => {
          capturedContainerRef.current = container
        }, [container])
        return <div>Test</div>
      }

      // When
      render(
        <DependencyProvider>
          <CaptureContainer />
        </DependencyProvider>
      )

      // Then
      expect(capturedContainerRef.current).toBeInstanceOf(DIContainer)
    })
  })
})
