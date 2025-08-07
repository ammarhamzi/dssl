import type { App } from 'vue'

interface ErrorInfo {
  message: string
  stack?: string
  componentName?: string
  componentStack?: string
}

/**
 * Global error handler for Vue application
 */
export function setupErrorHandler(app: App) {
  // Handle Vue errors
  app.config.errorHandler = (error: Error, instance, info) => {
    console.error('Vue Error Handler:', {
      error: error.message,
      info,
      component: instance?.$options?.name || 'Unknown',
      stack: error.stack
    })

    // Handle specific DOM manipulation errors
    if (error.message.includes('Cannot read properties of null') || 
        error.message.includes('parentNode') || 
        error.message.includes('nextSibling')) {
      
      console.warn('DOM manipulation error detected, attempting recovery...')
      
      // Force a re-render of the component if possible
      if (instance && instance.$forceUpdate) {
        try {
          instance.$forceUpdate()
        } catch (forceUpdateError) {
          console.warn('Force update failed:', forceUpdateError)
        }
      }
      
      // Don't throw the error to prevent app crashes
      return false
    }

    // For other errors, log them but don't crash the app
    console.error('Unhandled Vue error:', error)
    return false
  }

  // Handle global JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('Global Error Handler:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    })

    // Handle DOM manipulation errors
    if (event.message.includes('Cannot read properties of null') || 
        event.message.includes('parentNode') || 
        event.message.includes('nextSibling')) {
      
      console.warn('Global DOM manipulation error detected')
      event.preventDefault()
      return false
    }
  })

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', {
      reason: event.reason,
      promise: event.promise
    })

    // Handle DOM manipulation errors in promises
    if (event.reason && typeof event.reason === 'object' && 
        event.reason.message && 
        (event.reason.message.includes('Cannot read properties of null') || 
         event.reason.message.includes('parentNode') || 
         event.reason.message.includes('nextSibling'))) {
      
      console.warn('Promise DOM manipulation error detected')
      event.preventDefault()
      return false
    }
  })

  // Memory leak detection
  let memoryCheckInterval: NodeJS.Timer | null = null

  const startMemoryMonitoring = () => {
    if (memoryCheckInterval) {
      clearInterval(memoryCheckInterval)
    }

    memoryCheckInterval = setInterval(() => {
      if (performance.memory) {
        const memoryInfo = performance.memory
        const usedMB = Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024)
        const totalMB = Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024)
        const limitMB = Math.round(memoryInfo.jsHeapSizeLimit / 1024 / 1024)

        // Warn if memory usage is high
        if (usedMB > limitMB * 0.8) {
          console.warn(`High memory usage detected: ${usedMB}MB / ${limitMB}MB`)
        }

        // Log memory usage in development
        if (import.meta.env.DEV) {
          console.debug(`Memory usage: ${usedMB}MB / ${totalMB}MB (limit: ${limitMB}MB)`)
        }
      }
    }, 30000) // Check every 30 seconds
  }

  const stopMemoryMonitoring = () => {
    if (memoryCheckInterval) {
      clearInterval(memoryCheckInterval)
      memoryCheckInterval = null
    }
  }

  // Start memory monitoring
  startMemoryMonitoring()

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    stopMemoryMonitoring()
  })

  return {
    startMemoryMonitoring,
    stopMemoryMonitoring
  }
}

export default {
  install(app: App) {
    setupErrorHandler(app)
  }
} 