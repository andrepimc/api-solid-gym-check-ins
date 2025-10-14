import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest'
import { prisma } from "@/lib/prisma";

describe("Create Check-in e2e", () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it("should be able to create a check-in", async () => {
    await request(app.server).post('/users').send(
      { name: 'John Doe', email: '8V4ZP@example.com', password: '123456' }
    )
    const authResponse = await request(app.server).post('/sessions').send(
      { email: '8V4ZP@example.com', password: '123456' }
    )
    const { token } = authResponse.body

    const gym = await prisma.gym.create({
      data: {
        title: 'Javascript Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: -27.2092052,
        longitude: -49.6401091
      }
    })

    const response = await request(app.server)
      .post(`/checkIn/${gym.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(
        {
          latitude: -27.2092052,
          longitude: -49.6401091
        }
      )
    expect(response.statusCode).toEqual(201)
  })
})