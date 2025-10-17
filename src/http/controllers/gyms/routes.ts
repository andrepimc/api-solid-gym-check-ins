
import { verifyJwt } from "../../middleware/verify-jwt";
import { createController } from "./create";
import { searchController } from "./search";
import { nearbyController } from "./nearby";
import { FastifyInstance } from "fastify";
import { verifyRole } from "@/http/middleware/verify-role";

async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/gyms', searchController)
  app.get('/gyms/nearby', nearbyController)

  app.post('/gyms', { onRequest: verifyRole('ADMIN') }, createController)

}

export { gymsRoutes }