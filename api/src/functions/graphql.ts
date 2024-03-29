import { EventEmitter } from 'events'

import {
  createInMemoryCache,
  useResponseCache,
  UseResponseCacheParameter,
} from '@envelop/response-cache'

import { authDecoder } from '@redwoodjs/auth-dbauth-api'
import { createGraphQLHandler } from '@redwoodjs/graphql-server'

import directives from 'src/directives/**/*.{js,ts}'
import sdls from 'src/graphql/**/*.sdl.{js,ts}'
import services from 'src/services/**/*.{js,ts}'

import { getCurrentUser } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

const cache = createInMemoryCache()

const useResponseCacheParameters: UseResponseCacheParameter = {
  cache,
  includeExtensionMetadata: true,
  session: (context) => String(context.currentUser?.id),
  ttlPerSchemaCoordinate: {
    'Query.serverStatus': 1_000,
    'Query.lastLogsByUser': 2_000,
    'Query.cosminoSessions': 0,
  },
}

export const emitter = new EventEmitter()

emitter.on('invalidate', (entity) => {
  cache.invalidate([
    {
      typename: entity.type,
      id: entity.id,
    },
  ])
})

export const handler = createGraphQLHandler({
  getCurrentUser,
  authDecoder,
  loggerConfig: {
    logger,
    options: { operationName: true, tracing: true },
  },
  directives,
  sdls,
  services,
  extraPlugins: [useResponseCache(useResponseCacheParameters)],
  onException: () => {
    // Disconnect from your database with an unhandled exception.
    db.$disconnect()
  },
})
