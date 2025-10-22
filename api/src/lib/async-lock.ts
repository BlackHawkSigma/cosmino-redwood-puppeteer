import AsyncLock from 'async-lock'

import { logger } from './logger'

interface LockMetrics {
  username: string
  acquiredAt: number
  operation: string
}

interface LockStats {
  totalAcquired: number
  totalReleased: number
  totalTimeouts: number
  totalErrors: number
  activeLocks: number
  activeUsers: Array<{
    username: string
    waitingFor: number
  }>
}

class MonitoredAsyncLock {
  private lock: AsyncLock
  private activeLocks: Map<string, LockMetrics> = new Map()
  private lockStats = {
    totalAcquired: 0,
    totalReleased: 0,
    totalTimeouts: 0,
    totalErrors: 0,
  }
  private maxExecutionTime: number

  constructor(opts?: { maxExecutionTime?: number; timeout?: number }) {
    this.lock = new AsyncLock(opts)
    this.maxExecutionTime = opts?.maxExecutionTime || opts?.timeout || 20000
  }

  async acquire<T>(key: string | string[], fn: () => Promise<T>): Promise<T> {
    const username = Array.isArray(key) ? key[0] : key
    const startTime = Date.now()

    try {
      const result = await this.lock.acquire(key, async () => {
        // Lock is now actually acquired, record it
        this.activeLocks.set(username, {
          username,
          acquiredAt: startTime,
          operation: 'operation',
        })
        this.lockStats.totalAcquired++

        logger.debug(`[AsyncLock] Lock acquired for user: ${username}`, {
          activeLocks: this.activeLocks.size,
          totalAcquired: this.lockStats.totalAcquired,
        })

        try {
          // Execute the actual operation
          return await fn()
        } finally {
          // Always clean up the active lock tracking
          this.activeLocks.delete(username)
        }
      })

      const duration = Date.now() - startTime

      // Record successful completion
      this.lockStats.totalReleased++

      logger.debug(
        `[AsyncLock] Lock released for user: ${username} (${duration}ms)`,
        {
          duration,
          activeLocks: this.activeLocks.size,
          totalReleased: this.lockStats.totalReleased,
        }
      )

      return result
    } catch (error) {
      const duration = Date.now() - startTime
      this.activeLocks.delete(username)

      // Distinguish between timeout and other errors
      if (
        error.message?.includes('timeout') ||
        duration >= this.maxExecutionTime
      ) {
        this.lockStats.totalTimeouts++
        logger.error(
          `[AsyncLock] Lock timeout for user: ${username} (${duration}ms)`,
          {
            duration,
            activeLocks: this.activeLocks.size,
            totalTimeouts: this.lockStats.totalTimeouts,
            error: error.message,
          }
        )
      } else {
        this.lockStats.totalErrors++
        logger.error(
          `[AsyncLock] Lock error for user: ${username} (${duration}ms)`,
          {
            duration,
            activeLocks: this.activeLocks.size,
            totalErrors: this.lockStats.totalErrors,
            error: error.message,
          }
        )
      }

      throw error
    }
  }

  // Get current lock statistics
  getStats(): LockStats {
    return {
      ...this.lockStats,
      activeLocks: this.activeLocks.size,
      activeUsers: Array.from(this.activeLocks.values()).map((lock) => ({
        username: lock.username,
        waitingFor: Date.now() - lock.acquiredAt,
      })),
    }
  }

  // Get active locks
  getActiveLocks() {
    return Array.from(this.activeLocks.entries()).map(
      ([username, metrics]) => ({
        username,
        duration: Date.now() - metrics.acquiredAt,
        operation: metrics.operation,
      })
    )
  }

  // Reset statistics (useful for testing or periodic resets)
  resetStats() {
    this.lockStats = {
      totalAcquired: 0,
      totalReleased: 0,
      totalTimeouts: 0,
      totalErrors: 0,
    }
  }
}

export default MonitoredAsyncLock
