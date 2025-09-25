import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import dayjs from "dayjs";
import { ValidationTimeExpiredError } from "./errors/validation-time-expired-error";


interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
  ) { }

  async execute({ checkInId }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)
    if (!checkIn) {
      throw new ResourceNotFoundError()
    }
    const createdDateCheckIn = dayjs(checkIn.created_at)
    const actualDate = new Date()
    if (createdDateCheckIn.add(20, 'minute').isBefore(actualDate)) {
      throw new ValidationTimeExpiredError()
    }
    checkIn.validated_at = actualDate
    const checkInSaved = await this.checkInsRepository.save(checkIn)
    return { checkIn: checkInSaved }
  }

}