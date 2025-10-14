
import { verifyJwt } from "../../middleware/verify-jwt";
import { createController } from "./create";
import { FastifyInstance } from "fastify";
import { validateController } from "./validate";
import { metricsController } from "./metrics";
import { historyController } from "./history";

async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/checkIns/history', historyController)
  app.get('/checkIns/metrics', metricsController)
  app.patch('/checkIns/validate/:checkInId', validateController)

  app.post('/checkIn/:gymId', createController)


}

export { checkInsRoutes }