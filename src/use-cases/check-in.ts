import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";

// TDD -> red, green, refactor

interface CheckInUseCaseRequest {
  gymId: string
  userId: string
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository
  ) { }

  async execute({ userId, gymId }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(userId, new Date())
    if (checkInOnSameDay) throw new Error("You already checked in today")
    const checkIn = await this.checkInsRepository.create({ user_id: userId, gym_id: gymId })
    return { checkIn }
  }

}