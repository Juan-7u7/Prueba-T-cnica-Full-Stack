import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Cargar .env desde backend/ o ráz
dotenv.config();
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const envSchema = z.object({
  PORT: z.string().default('3000').transform(Number),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  CORS_ORIGIN: z.string().default('*'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.error('Invalid environment variables:', envVars.error.format());
  process.exit(1);
}

export const envs = envVars.data;
