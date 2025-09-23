import { FastifyInstance } from "fastify";
import { registerController } from "./controllers/register";
import { authenticateController } from "./controllers/authenticate";

async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerController)
  app.post('/sessions', authenticateController)
}

export { appRoutes }