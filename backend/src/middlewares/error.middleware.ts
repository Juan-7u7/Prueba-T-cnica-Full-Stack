import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/custom-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Manejar errores de Prisma u otros errores inesperados
  console.error(err.stack);
  
  return res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
  });
};
