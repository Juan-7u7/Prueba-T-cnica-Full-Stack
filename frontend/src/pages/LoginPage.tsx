import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;

      // Decodificar el token para extraer el rol
      const decoded: any = jwtDecode(token);
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', decoded.role);

      navigate('/records');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h1>Iniciar Sesión</h1>
        {error && <p className="error">{error}</p>}
        
        <div className="field">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@demo.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              style={{ paddingRight: '3rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                padding: '0.5rem',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: 600,
                width: 'auto',
                boxShadow: 'none'
              }}
            >
              {showPassword ? 'OCULTAR' : 'VER'}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Autenticando...' : 'Entrar'}
        </button>


      </form>
    </div>
  );
};

export default LoginPage;
