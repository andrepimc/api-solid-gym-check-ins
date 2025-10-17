import { FastifyRequest, FastifyReply } from "fastify";

export function verifyRole(roleToverify: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.user.role !== roleToverify) {
      return reply.status(401).send({ message: 'Unauthorized' })
    }
  }
}