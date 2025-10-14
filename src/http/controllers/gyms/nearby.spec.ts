import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest'
import { prisma } from "@/lib/prisma";

describe("Search Nearby Gym e2e", () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it("should be able to search nearby gyms by coordinates", async () => {
    await request(app.server).post('/users').send(
      { name: 'John Doe', email: '8V4ZP@example.com', password: '123456' }
    )
    const authResponse = await request(app.server).post('/sessions').send(
      { email: '8V4ZP@example.com', password: '123456' }
    )
    const { token } = authResponse.body

    await prisma.gym.createMany({
      data: [
        {
          title: 'Javascript Gym',
          description: 'Some description',
          phone: '11999999999',
          latitude: -27.2092052,
          longitude: -49.6401091
        },
        {
          title: 'Typescript Gym',
          description: 'Some description',
          phone: '11999999999',
          latitude: -28.2092052,
          longitude: -50.6401091
        }
      ]
    })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({ latitude: -27.2092052, longitude: -49.6401091 })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual(
      [expect.objectContaining({ title: 'Javascript Gym' })]
    )
  })
})