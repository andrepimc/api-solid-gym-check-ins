import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";

interface GetUserMetricsRequest {
  userId: string
}
interface GetUserMetricsResponse {
  count: number
}

export class GetUserMetricsUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository
  ) { }
  async execute({ userId }: GetUserMetricsRequest): Promise<GetUserMetricsResponse> {
    const count = await this.checkInsRepository.countByUserId(userId)
    return { count }
  }
}