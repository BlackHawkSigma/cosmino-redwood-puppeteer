import { createLogger, redactionsList } from '@redwoodjs/api/logger'

/**
 * Creates a logger with RedwoodLoggerOptions
 *
 * These extend and override default LoggerOptions,
 * can define a destination like a file or other supported pino log transport stream,
 * and sets whether or not to show the logger configuration settings (defaults to false)
 *
 * @param RedwoodLoggerOptions
 *
 * RedwoodLoggerOptions have
 * @param {options} LoggerOptions - defines how to log, such as redaction and format
 * @param {string | DestinationStream} destination - defines where to log, such as a transport stream or file
 * @param {boolean} showConfig - whether to display logger configuration on initialization
 */
export const logger = createLogger({
  options: { redact: [...redactionsList, 'userpwd'] },
  destination:
    process.env.NODE_ENV === 'production' ? './server.log' : undefined,
})

export const codeLogger = createLogger({
  options: { redact: [...redactionsList, 'userpwd'], level: 'trace' },
  destination: './codes.log',
})
