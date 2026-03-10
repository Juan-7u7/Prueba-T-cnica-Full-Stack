import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { envs } from '../config/envs';
import { CustomError } from '../utils/custom-error';
import { loginSchema } from '../schemas/auth.schema';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validar el cuerpo de la petición
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      throw new CustomError(result.error.issues[0].message, 400);
    }

    const { email, password } = result.data;
    const normalizedEmail = email.toLowerCase();

    // Buscar usuario por correo
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new CustomError('Credenciales incorrectas', 401);
    }

    // Comparar contraseñas
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new CustomError('Credenciales incorrectas', 401);
    }

    // Generar JWT
    const token = jwt.sign(
      { sub: user.id, role: user.role },
      envs.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
};
