import { z } from 'zod';

export const createRecordSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Formato de correo inválido'),
  category: z.enum(['A', 'B', 'C'] as const),
  status: z.string().optional(),
});

export const updateRecordSchema = createRecordSchema.partial();

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
