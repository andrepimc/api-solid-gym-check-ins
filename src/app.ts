import { fastify } from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError, z } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'

const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET_TOKEN,
})

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: z.treeifyError(error) })
  }
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})

export { app }