import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { GetUserMetricsUseCase } from '@/use-cases/get-user-metrics'
import { FastifyRequest, FastifyReply } from 'fastify'

async function metricsController(request: FastifyRequest, reply: FastifyReply) {

  const checkInsRepository = new PrismaCheckInsRepository()
  const metricsUseCase = new GetUserMetricsUseCase(checkInsRepository)

  const { count } = await metricsUseCase.execute({
    userId: request.user.sub,
  })


  return reply.status(200).send({ checkInsCount: count })
}

export { metricsController }