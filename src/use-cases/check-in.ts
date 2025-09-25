import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { calculateDistanteBetweenCoordinates } from "@/utils/calculate-distance-between-coordinates";
import { UserAlreadyCheckedInTodayError } from "./errors/user-already-did-checked-in-today-error";
import { UserTooMuchFarFromGymError } from "./errors/user-too-much-far-from-gym-error";

// TDD -> red, green, refactor

interface CheckInUseCaseRequest {
  gymId: string
  userId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) { }

  async execute({ userId, gymId, userLatitude, userLongitude }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)
    if (!gym) {
      throw new ResourceNotFoundError()
    }

    //calculate ditance from user to gym
    const distance = calculateDistanteBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
    )

    const MAX_DISTANCE_IN_KM = 0.1

    if (distance > MAX_DISTANCE_IN_KM) {
      throw new UserTooMuchFarFromGymError()
    }


    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(userId, new Date())
    if (checkInOnSameDay) {
      throw new UserAlreadyCheckedInTodayError()
    }
    const checkIn = await this.checkInsRepository.create({ user_id: userId, gym_id: gymId })
    return { checkIn }
  }

}