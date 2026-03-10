import { Role } from '@prisma/client';

// Usar declaración ambiental directamente en el archivo donde sea necesario o de forma que ts-node-dev lo detecte
import 'express';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
      role: Role;
    };
  }
}
