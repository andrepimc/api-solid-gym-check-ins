
import { verifyJwt } from "../../middleware/verify-jwt";
import { createController } from "./create";
import { searchController } from "./search";
import { nearbyController } from "./nearby";
import { FastifyInstance } from "fastify";

async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/gyms', searchController)
  app.get('/gyms/nearby', nearbyController)

  app.post('/gyms', createController)

}

export { gymsRoutes }