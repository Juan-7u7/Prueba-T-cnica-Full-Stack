import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { envs } from '../config/envs';
import { CustomError } from '../utils/custom-error';
import { Role } from '@prisma/client';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new CustomError('No se proporcionó un token', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, envs.JWT_SECRET) as { sub: string, role: Role };
    
    // Omitir comprobación de tipos para la extensión req.user
    const requestWithUser = req as any;
    requestWithUser.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(new CustomError('Token inválido o expirado', 401));
  }
};

export const roleMiddleware = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestWithUser = req as any;
    const user = requestWithUser.user;
    
    if (!user) {
      return next(new CustomError('No autorizado', 401));
    }

    if (!allowedRoles.includes(user.role)) {
      return next(new CustomError('Prohibido: permisos insuficientes', 403));
    }

    next();
  };
};
