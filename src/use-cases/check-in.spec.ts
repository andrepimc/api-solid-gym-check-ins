import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";



let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase //sut => system under test

describe("Check-in Use Case", () => {

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({ id: "fixed-id", title: "JavaScript Gym", description: null, phone: null, latitude: 0, longitude: 0 })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should be able to check-in", async () => {
    const { checkIn } = await sut.execute({ userId: "1", gymId: "fixed-id", userLatitude: 0, userLongitude: 0 })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it("should not be able to check-in twice in a same day", async () => {
    await sut.execute({ userId: "1", gymId: "fixed-id", userLatitude: 0, userLongitude: 0 })
    await expect(() => sut.execute({ userId: "1", gymId: "fixed-id", userLatitude: 0, userLongitude: 0 }))
      .rejects.toBeInstanceOf(Error)
  })

  it("should be able to check-in twice with same user but in a different day", async () => {
    vi.setSystemTime(new Date(2025, 8, 20, 8, 0, 0)) // 2025-09-20 08:00:00 
    await sut.execute({ userId: "1", gymId: "fixed-id", userLatitude: 0, userLongitude: 0 })
    vi.setSystemTime(new Date(2025, 8, 21, 8, 0, 0)) // 2025-09-21 08:00:00 
    const { checkIn } = await sut.execute({ userId: "1", gymId: "fixed-id", userLatitude: 0, userLongitude: 0 })
    expect(checkIn.id).toEqual(expect.any(String)) //ou seja, não espero um erro
  })

  it("should not be able to check-in on distant gym", async () => {
    const gym = await gymsRepository.create({ title: "JavaScript Gym", description: null, phone: null, latitude: -27.2092052, longitude: -49.6401091 })

    await expect(() => sut.execute({ userId: "1", gymId: gym.id, userLatitude: 0, userLongitude: 0 }))
      .rejects.toBeInstanceOf(Error);
  })
})