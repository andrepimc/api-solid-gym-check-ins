import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest'

describe("Authenticate e2e", () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it("should be able to authenticate after registering", async () => {
    await request(app.server).post('/users').send(
      { name: 'John Doe', email: '8V4ZP@example.com', password: '123456' }
    )
    const response = await request(app.server).post('/sessions').send(
      { email: '8V4ZP@example.com', password: '123456' }
    )
    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({ token: expect.any(String) })
  })
})