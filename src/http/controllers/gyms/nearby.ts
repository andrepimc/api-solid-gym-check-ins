import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { SearchNearbyGymsUseCase } from '@/use-cases/search-nearby-gyms'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

async function nearbyController(request: FastifyRequest, reply: FastifyReply) {
  const searchNearbyGymQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    })
  })
  const { latitude, longitude } = searchNearbyGymQuerySchema.parse(request.query)

  const gymsRepository = new PrismaGymsRepository()
  const searchNearbyUseCase = new SearchNearbyGymsUseCase(gymsRepository)

  const { gyms } = await searchNearbyUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude
  })


  return reply.status(200).send({ gyms })
}

export { nearbyController }