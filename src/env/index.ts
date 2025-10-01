import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET_TOKEN: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.log('❌ Invalid environment variables', z.treeifyError(_env.error))
  throw new Error('Invalid environment variables')
}

export const env = _env.data