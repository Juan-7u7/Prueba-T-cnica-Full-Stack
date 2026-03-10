import { Router } from 'express';
import { 
  getRecords, 
  createRecord, 
  updateRecord, 
  deleteRecord 
} from '../controllers/record.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Configurar auth como middleware base
router.use(authMiddleware);

// Público (viewer, editor, admin)
router.get('/', getRecords);

// Solo Editor y Admin
router.post('/', roleMiddleware([Role.editor, Role.admin]), createRecord);
router.patch('/:id', roleMiddleware([Role.editor, Role.admin]), updateRecord);

// Solo Admin
router.delete('/:id', roleMiddleware([Role.admin]), deleteRecord);

export default router;
