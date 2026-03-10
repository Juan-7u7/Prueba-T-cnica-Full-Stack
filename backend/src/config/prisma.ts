import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { envs } from './envs';

// Inicializar el pool de Postgres
const pool = new Pool({ connectionString: envs.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Exportar el cliente Prisma con el adaptador
const prisma = new PrismaClient({ adapter });

export default prisma;
