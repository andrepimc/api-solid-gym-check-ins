import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";


interface SearchNearbyGymsUseCaseRequest {
  userLatitude: number,
  userLongitude: number
}

interface SearchNearbyGymsUseCaseResponse {
  gyms: Gym[]
}

export class SearchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {

  }
  async execute({ userLatitude, userLongitude }: SearchNearbyGymsUseCaseRequest): Promise<SearchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findNearby(userLatitude, userLongitude)
    return { gyms }
  }
}