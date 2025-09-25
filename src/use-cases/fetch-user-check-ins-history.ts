import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";

interface FecthUserCheckInsHistoryUseCaseRequest {
  userId: string,
  page: number
}
interface FecthUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository
  ) { }
  async execute({ userId, page }: FecthUserCheckInsHistoryUseCaseRequest): Promise<FecthUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId, page)
    return { checkIns }
  }
}