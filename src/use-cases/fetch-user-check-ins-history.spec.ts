import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { it, describe, expect, beforeEach } from 'vitest'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch User Check-ins History Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  })
  it("should be able to fetch all history of check ins from a user", async () => {
    await checkInsRepository.create({ gym_id: 'gym-01', user_id: 'user-ut' })
    const { checkIns } = await sut.execute({ userId: 'user-ut', page: 1 })
    expect(checkIns).toHaveLength(1)
    expect(checkIns).toEqual(
      [
        expect.objectContaining({ gym_id: 'gym-01' })
      ]
    )
  })

  it("should be able to fetch paginated history of check ins from a user", async () => {
    for (var i = 1; i <= 22; i++) {
      await checkInsRepository.create({ gym_id: `gym-${i}`, user_id: 'user-ut' })
    }
    const { checkIns } = await sut.execute({ userId: 'user-ut', page: 2 })
    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual(
      [
        expect.objectContaining({ gym_id: 'gym-21' }),
        expect.objectContaining({ gym_id: 'gym-22' })
      ]
    )
  })
})