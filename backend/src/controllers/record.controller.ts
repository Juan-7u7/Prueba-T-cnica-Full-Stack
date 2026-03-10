import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { createRecordSchema, updateRecordSchema } from '../schemas/record.schema';
import { CustomError } from '../utils/custom-error';

/**
 * Obtener todos los registros con paginación y búsqueda
 */
export const getRecords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const { name, email, category } = req.query;

    const where: any = {};

    if (category) {
      where.category = category as string;
    }

    if (name || email) {
      where.OR = [
        { name: { contains: (name as string) || '', mode: 'insensitive' } },
        { email: { contains: (email as string) || '', mode: 'insensitive' } },
      ].filter(c => {
        const val = Object.values(c)[0] as any;
        return val.contains !== '';
      });
    }

    const [total, data] = await Promise.all([
      prisma.record.count({ where }),
      prisma.record.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    res.json({
      data,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear un nuevo registro
 */
export const createRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = createRecordSchema.safeParse(req.body);
    if (!result.success) {
      throw new CustomError(result.error.issues[0].message, 400);
    }

    const record = await prisma.record.create({
      data: result.data,
    });

    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar un registro existente
 */
export const updateRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = updateRecordSchema.safeParse(req.body);
    
    if (!result.success) {
      throw new CustomError(result.error.issues[0].message, 400);
    }

    const record = await prisma.record.update({
      where: { id },
      data: result.data,
    });

    res.json(record);
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar un registro
 */
export const deleteRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.record.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
