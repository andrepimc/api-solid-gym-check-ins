import { FastifyInstance } from "fastify";
import { registerController } from "./register";
import { authenticateController } from "./authenticate";
import { profileController } from "./profile";
import { verifyJwt } from "../../middleware/verify-jwt";

async function usersRoutes(app: FastifyInstance) {
  app.post('/users', registerController)
  app.post('/sessions', authenticateController)

  //rotas autenticadas
  app.get('/me', { onRequest: verifyJwt }, profileController)
}

export { usersRoutes }