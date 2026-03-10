import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { envs } from './config/envs';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { CustomError } from './utils/custom-error';

const app = express();

// Análisis de peticiones (Parsing)
app.use(express.json());

// Seguridad (CORS)
app.use(cors({ origin: envs.CORS_ORIGIN }));

// Rutas de la API
app.use('/api', routes);

// Manejador de errores 404
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new CustomError('Recurso no encontrado', 404));
});

// Manejador de errores global
app.use(errorHandler);

export default app;
