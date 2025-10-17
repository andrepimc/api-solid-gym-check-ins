import { fastify } from 'fastify'
import { usersRoutes } from './http/controllers/users/routes'
import { ZodError, z } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { checkInsRoutes } from './http/controllers/check-ins/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import fastifyCookie from '@fastify/cookie'

const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET_TOKEN,
  cookie: {
    cookieName: 'refreshToken',
    signed: false //sem assinatura (sem criptografia/hashing)
  },
  sign: {
    expiresIn: '10m' //10 minutes
  }
})

app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

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