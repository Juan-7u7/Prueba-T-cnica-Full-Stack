import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Adjuntar token a cada petición si está disponible
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      toast.error('Sesión expirada. Por favor, inicia sesión de nuevo.');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }

    if (status === 403) {
      toast.error('Acceso denegado. Permisos insuficientes.');
    }

    return Promise.reject(error);
  }
);

export default api;
