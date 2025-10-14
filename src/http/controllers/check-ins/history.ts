import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from '@/use-cases/fetch-user-check-ins-history'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

async function historyController(request: FastifyRequest, reply: FastifyReply) {
  const historyQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })
  const { page } = historyQuerySchema.parse(request.query)

  const checkInsRepository = new PrismaCheckInsRepository()
  const historyUseCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository)

  const { checkIns } = await historyUseCase.execute({
    userId: request.user.sub,
    page
  })


  return reply.status(200).send({ checkIns })
}

export { historyController }