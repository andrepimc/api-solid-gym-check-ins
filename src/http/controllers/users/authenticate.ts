import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "@/use-cases/authenticate";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function authenticateController(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.email(),
    password: z.string(),
  })
  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    const { user } = await authenticateUseCase.execute({ email, password })

    const token = await reply.jwtSign({
      role: user.role
    }, {
      sign: {
        sub: user.id //sub -> subject
      }
    })

    const refreshToken = await reply.jwtSign({
      role: user.role
    }, {
      sign: {
        sub: user.id,
        expiresIn: '7d'
        //7 dias (tempo de expiração do refresh token - caso o usuário fique 7 dias ou mais sem acessar a aplicação, perde o login)
      }
    })

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/', //todas as rotas podem ter acesso ao refresh token (cookie)
        secure: true, //https (encriptado) - frontend não consegue acessar o valor do cookie
        sameSite: true, //somente acessivel dentro do mesmo dominio
        httpOnly: true //apenas acessado pelo backend (contexto da requisição)
      })
      .status(200)
      .send({ token })

  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }
  }
}
