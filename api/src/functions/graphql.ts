import { EventEmitter } from 'events'

import {
  useResponseCache,
  UseResponseCacheParameter,
  createInMemoryCache,
} from '@envelop/response-cache'

import { createGraphQLHandler } from '@redwoodjs/graphql-server'

import directives from 'src/directives/**/*.{js,ts}'
import sdls from 'src/graphql/**/*.sdl.{js,ts}'
import { getCurrentUser } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import services from 'src/services/**/*.{js,ts}'

const cache = createInMemoryCache()

const useResponseCacheParameters: UseResponseCacheParameter = {
  cache,
  includeExtensionMetadata: true,
  session: (context) => String(context.currentUser?.id),
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
  loggerConfig: {
    logger,
    options: { operationName: true, requestId: true, tracing: true },
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
