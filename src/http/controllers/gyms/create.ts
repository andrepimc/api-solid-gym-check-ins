import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CreateGymUseCase } from '@/use-cases/create-gym'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

async function createController(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    })

  })
  const { title, description, phone, latitude, longitude } = createGymBodySchema.parse(request.body)

  const gymsRepository = new PrismaGymsRepository()
  const createUseCase = new CreateGymUseCase(gymsRepository)

  const { gym } = await createUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude
  })


  return reply.status(201).send({ gym })
}

export { createController }