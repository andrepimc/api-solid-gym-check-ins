import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { CheckInUseCase } from "./check-in";


let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase //sut => system under test

describe("Check-in Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)
  })
  it("should be able to check-in", async () => {
    const { checkIn } = await sut.execute({ userId: "1", gymId: "1" })
    expect(checkIn.id).toEqual(expect.any(String))
  })
})