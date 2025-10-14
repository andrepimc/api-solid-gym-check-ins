import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest'

describe("Create Gym e2e", () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it("should be able to create a gym", async () => {
    await request(app.server).post('/users').send(
      { name: 'John Doe', email: '8V4ZP@example.com', password: '123456' }
    )
    const authResponse = await request(app.server).post('/sessions').send(
      { email: '8V4ZP@example.com', password: '123456' }
    )
    const { token } = authResponse.body

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(
        {
          title: 'Javascript Gym', description: 'Some description', phone: '11999999999', latitude: -27.2092052, longitude: -49.6401091
        }
      )
    expect(response.statusCode).toEqual(201)
    expect(response.body.gym).toEqual(
      expect.objectContaining({ title: 'Javascript Gym' })
    )
  })
})