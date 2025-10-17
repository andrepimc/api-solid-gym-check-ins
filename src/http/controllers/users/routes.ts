import { FastifyInstance } from "fastify";
import { registerController } from "./register";
import { authenticateController } from "./authenticate";
import { profileController } from "./profile";
import { verifyJwt } from "../../middleware/verify-jwt";
import { refreshController } from "./refresh";

async function usersRoutes(app: FastifyInstance) {
  app.post('/users', registerController)
  app.post('/sessions', authenticateController)


  app.patch('/token/refresh', refreshController)

  //rotas autenticadas
  app.get('/me', { onRequest: verifyJwt }, profileController)
}

export { usersRoutes }