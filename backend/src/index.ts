import app from './app';
import { envs } from './config/envs';

app.listen(envs.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${envs.PORT}`);
  console.log(`Entorno: ${envs.NODE_ENV}`);
});
