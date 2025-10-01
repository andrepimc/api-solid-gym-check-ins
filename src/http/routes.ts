import { FastifyInstance } from "fastify";
import { registerController } from "./controllers/register";
import { authenticateController } from "./controllers/authenticate";
import { profileController } from "./controllers/profile";
import { verifyJwt } from "./middleware/verify-jwt";

async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerController)
  app.post('/sessions', authenticateController)

  //rotas autenticadas
  app.get('/me', { onRequest: verifyJwt }, profileController)
}

export { appRoutes }