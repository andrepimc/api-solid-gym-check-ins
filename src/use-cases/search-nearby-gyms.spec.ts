import { beforeEach, describe, it, expect } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchNearbyGymsUseCase } from "./search-nearby-gyms";


let gymsRepository: InMemoryGymsRepository
let sut: SearchNearbyGymsUseCase

describe("Search Nearby Gyms Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchNearbyGymsUseCase(gymsRepository)
  })

  it("should be able to search for nearby gyms", async () => {
    await gymsRepository.create({ title: "Near Gym", description: null, phone: null, latitude: -27.2092052, longitude: -49.6401091 })
    await gymsRepository.create({ title: "Far Gym", description: null, phone: null, latitude: -28.2092052, longitude: -50.6401091 })
    const { gyms } = await sut.execute({ userLatitude: -27.2092052, userLongitude: -49.6401091 }) //same coordinate as near gym
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Near Gym" })
    ])
  })
}); 