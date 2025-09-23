import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { CheckInUseCase } from "./check-in";



let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase //sut => system under test

describe("Check-in Use Case", () => {

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should be able to check-in", async () => {
    const { checkIn } = await sut.execute({ userId: "1", gymId: "1" })
    expect(checkIn.id).toEqual(expect.any(String))
  })
  it("should not be able to check-in twice in a same day", async () => {
    await sut.execute({ userId: "1", gymId: "1" })
    await expect(() => sut.execute({ userId: "1", gymId: "1" }))
      .rejects.toBeInstanceOf(Error)
  })
  it("should be able to check-in twice with same user but in a different day", async () => {
    vi.setSystemTime(new Date(2025, 8, 20, 8, 0, 0)) // 2025-09-20 08:00:00 
    await sut.execute({ userId: "1", gymId: "1" })
    vi.setSystemTime(new Date(2025, 8, 21, 8, 0, 0)) // 2025-09-21 08:00:00 
    const { checkIn } = await sut.execute({ userId: "1", gymId: "1" })
    expect(checkIn.id).toEqual(expect.any(String)) //ou seja, não espero um erro
  })
})