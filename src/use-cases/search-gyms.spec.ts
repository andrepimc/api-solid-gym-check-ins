import { beforeEach, describe, it, expect } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe("Search Gyms Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })
  it("should be able to search for gyms passing a query (title)", async () => {
    await gymsRepository.create({ title: "JavaScript Gym", description: null, phone: null, latitude: -27.2092052, longitude: -49.6401091 })
    await gymsRepository.create({ title: "TypeScript Gym", description: null, phone: null, latitude: -27.2092052, longitude: -49.6401091 })
    const { gyms } = await sut.execute({ query: "JavaScript", page: 1 })
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym" })
    ])
  })
}); 