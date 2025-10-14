import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest'

describe("Profile e2e", () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it("should be able to return a profile", async () => {
    await request(app.server).post('/users').send(
      { name: 'John Doe', email: '8V4ZP@example.com', password: '123456' }
    )
    const authResponse = await request(app.server).post('/sessions').send(
      { email: '8V4ZP@example.com', password: '123456' }
    )
    const { token } = authResponse.body
    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send(
        { email: '8V4ZP@example.com', password: '123456' }
      )
    expect(response.statusCode).toEqual(200)
    expect(response.body.user).toEqual(
      expect.objectContaining({ email: '8V4ZP@example.com', name: 'John Doe' })
    )
  })
})