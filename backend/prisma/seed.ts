import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL no encontrada');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Limpiar datos existentes
  await prisma.record.deleteMany();
  await prisma.user.deleteMany();

  // Datos de usuarios de prueba
  const users = [
    { email: 'admin@demo.com', password: 'Admin#123', role: Role.admin },
    { email: 'editor@demo.com', password: 'Editor#123', role: Role.editor },
    { email: 'viewer@demo.com', password: 'Viewer#123', role: Role.viewer },
  ];

  // Hashear contraseñas y crear usuarios
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        role: user.role,
      },
    });
  }

  // Generar 37 registros para la paginación
  const categories = ['A', 'B', 'C'];
  const statuses = ['Activo', 'Pendiente', 'Cerrado', null];

  for (let i = 1; i <= 37; i++) {
    await prisma.record.create({
      data: {
        name: `Registro ${i}`,
        email: `registro${i}@ejemplo.com`,
        category: categories[i % 3],
        status: statuses[i % 4],
      },
    });
  }

  console.log('Seed completado con éxito');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
