import { describe, it, expect, beforeEach } from "vitest";
import { GetUserProfileUseCase } from "./get-user-profile";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository
let getUserProfileUseCase: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)
  })

  it("should be able to get user profile passing its correct id", async () => {
    const { id } = await usersRepository.create({ name: 'John Doe', email: '8V4ZP@example.com', password_hash: '123456' })

    const { user } = await getUserProfileUseCase.execute({ userId: id })

    expect(user.name).toEqual('John Doe')
  })

  it("should not be able to get user profile when passing a incorrect id", async () => {
    await expect(() => getUserProfileUseCase.execute({ userId: "invalid-id" }))
      .rejects.toBeInstanceOf(ResourceNotFoundError)
  })
});