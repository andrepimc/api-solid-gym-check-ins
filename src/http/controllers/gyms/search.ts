import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { SearchGymsUseCase } from '@/use-cases/search-gyms'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

async function searchController(request: FastifyRequest, reply: FastifyReply) {
  const searchGymQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })
  const { query, page } = searchGymQuerySchema.parse(request.query)

  const gymsRepository = new PrismaGymsRepository()
  const searchUseCase = new SearchGymsUseCase(gymsRepository)

  const { gyms } = await searchUseCase.execute({
    query,
    page
  })


  return reply.status(200).send({ gyms })
}

export { searchController }