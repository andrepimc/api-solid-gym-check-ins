import { Gym, Prisma } from "@prisma/client";

export interface GymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findById(id: string): Promise<Gym | null>
  findMany(query: string, page: number): Promise<Gym[]>
  findNearby(latitude: number, longitude: number): Promise<Gym[]>
}