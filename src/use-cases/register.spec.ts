import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let registerUseCase: RegisterUseCase

describe('Register UseCase', async () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    registerUseCase = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {

    const { user } = await registerUseCase.execute({ name: 'John Doe', email: '8V4ZP@example.com', password: '123456' })

    expect(user.id).toEqual(expect.any(String))

  })

  it('should hash user password upon registration', async () => {

    const password = '123456'

    const { user } = await registerUseCase.execute({ name: 'John Doe', email: '8V4ZP@example.com', password })

    const isPasswordCorrectlyHashed = await compare(password, user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email', async () => {

    await registerUseCase.execute({ name: 'John Doe', email: '8V4ZP@example.com', password: '123456' })

    await expect(() => registerUseCase.execute(
      { name: 'John Doe', email: '8V4ZP@example.com', password: '123456' }
    ))
      .rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})

