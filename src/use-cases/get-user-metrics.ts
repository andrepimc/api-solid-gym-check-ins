import { CheckInsRepository } from "@/repositories/check-ins-repository";

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