import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from '@/use-cases/fetch-user-check-ins-history'
import { ValidateCheckInUseCase } from '@/use-cases/validate-check-in'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

async function validateController(request: FastifyRequest, reply: FastifyReply) {
  const validateParamsSchema = z.object({
    checkInId: z.uuid(),
  })
  const { checkInId } = validateParamsSchema.parse(request.params)

  const checkInsRepository = new PrismaCheckInsRepository()
  const validateUseCase = new ValidateCheckInUseCase(checkInsRepository)

  await validateUseCase.execute({
    checkInId
  })


  return reply.status(204).send()
}

export { validateController }