import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "@/use-cases/authenticate";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { FastifyReply, FastifyRequest } from "fastify";


export async function refreshController(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true }) //verifica se o refresh token é valido (cookie)

  const { role } = request.user

  const token = await reply.jwtSign({
    role
  }, {
    sign: {
      sub: request.user.sub //sub -> subject
    }
  })

  const refreshToken = await reply.jwtSign({
    role
  }, {
    sign: {
      sub: request.user.sub,
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

}
