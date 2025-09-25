import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ValidationTimeExpiredError } from "./errors/validation-time-expired-error";

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase //sut => system under test

describe("Validate Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should be able to validate check-in", async () => {
    const createdCheckIn = await checkInsRepository.create({ gym_id: "gym-01", user_id: "user-01" })
    const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id })
    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })

  it("should not be able to validate check-in after 20 minutes", async () => {
    vi.setSystemTime(new Date(2025, 9, 25, 8, 0, 0))
    const createdCheckIn = await checkInsRepository.create({ gym_id: "gym-01", user_id: "user-01" })
    const twentyOneMinutesInMs = 1000 * 60 * 21
    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() => sut.execute({ checkInId: createdCheckIn.id })).rejects.toBeInstanceOf(ValidationTimeExpiredError)
  })


})