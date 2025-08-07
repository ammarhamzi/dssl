import { ref, onUnmounted, onDeactivated } from 'vue';

interface CleanupItem {
  id: number | NodeJS.Timeout | NodeJS.Timer;
  type: 'timeout' | 'interval' | 'event';
  cleanup: () => void;
}

/**
 * Composable for preventing memory leaks by managing timers, intervals, and event listeners
 */
export function useMemoryLeakPrevention() {
  const cleanupItems = ref<CleanupItem[]>([]);

  /**
   * Add a timeout with automatic cleanup
   */
  const addTimeout = (callback: () => void, delay: number): NodeJS.Timeout => {
    const timeoutId = setTimeout(callback, delay);
    
    cleanupItems.value.push({
      id: timeoutId,
      type: 'timeout',
      cleanup: () => clearTimeout(timeoutId)
    });
    
    return timeoutId;
  };

  /**
   * Add an interval with automatic cleanup
   */
  const addInterval = (callback: () => void, delay: number): NodeJS.Timer => {
    const intervalId = setInterval(callback, delay);
    
    cleanupItems.value.push({
      id: intervalId,
      type: 'interval',
      cleanup: () => clearInterval(intervalId)
    });
    
    return intervalId;
  };

  /**
   * Add an event listener with automatic cleanup
   */
  const addEventListener = (
    target: EventTarget,
    event: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void => {
    target.addEventListener(event, listener, options);
    
    cleanupItems.value.push({
      id: Date.now() + Math.random(), // Generate unique ID
      type: 'event',
      cleanup: () => target.removeEventListener(event, listener, options)
    });
  };

  /**
   * Remove a specific cleanup item
   */
  const removeCleanupItem = (id: number | NodeJS.Timeout | NodeJS.Timer): void => {
    const index = cleanupItems.value.findIndex(item => item.id === id);
    if (index !== -1) {
      const item = cleanupItems.value[index];
      item.cleanup();
      cleanupItems.value.splice(index, 1);
    }
  };

  /**
   * Clear all cleanup items
   */
  const clearAll = (): void => {
    cleanupItems.value.forEach(item => {
      try {
        item.cleanup();
      } catch (error) {
        console.warn('Error during cleanup:', error);
      }
    });
    cleanupItems.value = [];
  };

  /**
   * Get cleanup statistics
   */
  const getStats = () => {
    const stats = {
      total: cleanupItems.value.length,
      timeouts: cleanupItems.value.filter(item => item.type === 'timeout').length,
      intervals: cleanupItems.value.filter(item => item.type === 'interval').length,
      events: cleanupItems.value.filter(item => item.type === 'event').length
    };
    return stats;
  };

  // Automatic cleanup on component unmount
  onUnmounted(() => {
    clearAll();
  });

  // Cleanup on component deactivation (for keep-alive components)
  onDeactivated(() => {
    clearAll();
  });

  return {
    addTimeout,
    addInterval,
    addEventListener,
    removeCleanupItem,
    clearAll,
    getStats,
    cleanupItems: cleanupItems.value
  };
} 