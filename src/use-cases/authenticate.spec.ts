import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { beforeEach } from "vitest";

let usersRepository: InMemoryUsersRepository
let authenticateUseCase: AuthenticateUseCase

describe("Authenticate UseCase", async () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUseCase = new AuthenticateUseCase(usersRepository)
  })
  it('should be able to authenticate', async () => {
    const passwordHashed = await hash('123456', 6)

    await usersRepository.create({ name: 'John Doe', email: '8V4ZP@example.com', password_hash: passwordHashed })

    const { user } = await authenticateUseCase.execute({ email: '8V4ZP@example.com', password: '123456' })

    expect(user.name).toEqual('John Doe')
  })

  it("should not be able to authenticate with wrong email", async () => {
    const passwordHashed = await hash('123456', 6)

    await usersRepository.create({ name: 'John Doe', email: '8V4ZP@example.com', password_hash: passwordHashed })

    await expect(() => authenticateUseCase.execute({ email: 'wrong-email@example.com', password: '123456' }))
      .rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it("should not be able to authenticate with wrong password", async () => {
    const passwordHashed = await hash('123456', 6)

    await usersRepository.create({ name: 'John Doe', email: '8V4ZP@example.com', password_hash: passwordHashed })

    await expect(() => authenticateUseCase.execute({ email: '8V4ZP@example.com', password: 'wrong-password' }))
      .rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})