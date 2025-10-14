import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest'
import { prisma } from "@/lib/prisma";
import { check } from "zod";

describe("Validate User Check-in e2e", () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it("should be able to validate a user check-in", async () => {
    await request(app.server).post('/users').send(
      { name: 'John Doe', email: '8V4ZP@example.com', password: '123456' }
    )
    const authResponse = await request(app.server).post('/sessions').send(
      { email: '8V4ZP@example.com', password: '123456' }
    )
    const { token } = authResponse.body

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'Javascript Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: -27.2092052,
        longitude: -49.6401091
      }
    })

    const checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id
      }
    })


    const response = await request(app.server)
      .patch(`/checkIns/validate/${checkIn.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)

    const checkInValidated = await prisma.checkIn.findFirstOrThrow()

    expect(checkInValidated.validated_at).toEqual(expect.any(Date))
  })
})