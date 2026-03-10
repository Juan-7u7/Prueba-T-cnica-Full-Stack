import { useState, useEffect } from 'react';
import api from '../api/axios';
import { z } from 'zod';

// Esquema compartido para la validación en el frontend
const recordSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Formato de correo inválido'),
  category: z.enum(['A', 'B', 'C'] as const),
  status: z.string().optional(),
});

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  recordToEdit?: any;
}

const RecordModal = ({ isOpen, onClose, onSuccess, recordToEdit }: RecordModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'A',
    status: '',
  });
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recordToEdit) {
      setFormData({
        name: recordToEdit.name,
        email: recordToEdit.email,
        category: recordToEdit.category,
        status: recordToEdit.status || '',
      });
    } else {
      setFormData({ name: '', email: '', category: 'A', status: '' });
    }
    setFieldErrors({});
    setGlobalError('');
  }, [recordToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const result = recordSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message;
        }
      });
      setFieldErrors(errors);
      return false;
    }
    setFieldErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setGlobalError('');

    try {
      if (recordToEdit) {
        await api.patch(`/records/${recordToEdit.id}`, formData);
      } else {
        await api.post('/records', formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setGlobalError(err.response?.data?.message || 'Ocurrió un error al guardar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{recordToEdit ? 'Editar Registro' : 'Crear Nuevo Registro'}</h2>
        
        {globalError && <div className="error">{globalError}</div>}
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="modal-name">Nombre</label>
            <input
              id="modal-name"
              type="text"
              className={fieldErrors.name ? 'input-error' : ''}
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
              }}
              required
            />
            {fieldErrors.name && <span className="field-error-msg">{fieldErrors.name}</span>}
          </div>

          <div className="field">
            <label htmlFor="modal-email">Correo Electrónico</label>
            <input
              id="modal-email"
              type="email"
              className={fieldErrors.email ? 'input-error' : ''}
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
              }}
              required
            />
            {fieldErrors.email && <span className="field-error-msg">{fieldErrors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="modal-category">Categoría</label>
            <select
              id="modal-category"
              className={fieldErrors.category ? 'input-error' : ''}
              value={formData.category}
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value });
                if (fieldErrors.category) setFieldErrors({ ...fieldErrors, category: '' });
              }}
            >
              <option value="A">Categoría A</option>
              <option value="B">Categoría B</option>
              <option value="C">Categoría C</option>
            </select>
            {fieldErrors.category && <span className="field-error-msg">{fieldErrors.category}</span>}
          </div>

          <div className="field">
            <label htmlFor="modal-status">Estado (Opcional)</label>
            <input
              id="modal-status"
              type="text"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="cancel-btn"
            >
              Cancelar
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Procesando...' : (recordToEdit ? 'Guardar Cambios' : 'Crear Registro')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordModal;
