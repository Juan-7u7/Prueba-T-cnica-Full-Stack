import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { useDebounce } from '../hooks/useDebounce';
import RecordModal from '../components/RecordModal';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const RecordsPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const debouncedSearch = useDebounce(search, 300);
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    const roleLabel = getRoleLabel(userRole);
    document.title = `Registros - ${roleLabel} | Prueba Técnica`;
  }, [userRole]);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        name: debouncedSearch,
        category: category,
      });

      const response = await api.get(`/records?${params.toString()}`);
      setData(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (err) {
      toast.error('Error al cargar los registros de la base de datos');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro?')) return;
    try {
      await api.delete(`/records/${id}`);
      fetchRecords();
    } catch (err) {
      // Error manejado por el interceptor
    }
  };

  const handleEdit = (record: any) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedRecord(null);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const getRoleLabel = (role: string | null) => {
    switch(role) {
      case 'admin': return 'Administrador';
      case 'editor': return 'Editor';
      case 'viewer': return 'Espectador';
      default: return role;
    }
  };

  return (
    <div className="records-container">
      <header className="page-header">
        <div className="header-titles">
          <h1 style={{ margin: 0 }}>Prueba Técnica</h1>
          <p className="total-items">Total de registros: {total}</p>
        </div>
        <div className="header-user">
          <span className="user-badge">
            Usuario: <strong>{getRoleLabel(userRole)}</strong>
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Salir
          </button>
        </div>
      </header>

      <section className="filter-section">
        <div className="search-field">
          <label htmlFor="search">Buscar</label>
          <input
            id="search"
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-field">
          <label htmlFor="category">Categoría</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="A">Categoría A</option>
            <option value="B">Categoría B</option>
            <option value="C">Categoría C</option>
          </select>
        </div>

        {(userRole === 'admin' || userRole === 'editor') && (
          <button className="new-record-btn" onClick={handleCreate}>
            + Nuevo Registro
          </button>
        )}
      </section>

      <div className="content-area">
        {loading ? (
          <Spinner />
        ) : data.length > 0 ? (
          <>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((record: any) => (
                    <tr key={record.id}>
                      <td data-label="Nombre" style={{ fontWeight: 500 }}>{record.name}</td>
                      <td data-label="Correo">{record.email}</td>
                      <td data-label="Categoría">
                        <span style={{ padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '0.25rem', fontSize: '0.75rem' }}>
                          {record.category}
                        </span>
                      </td>
                      <td data-label="Estado">{record.status || 'N/A'}</td>
                      <td data-label="Acciones">
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          {(userRole === 'admin' || userRole === 'editor') && (
                            <button 
                              onClick={() => handleEdit(record)}
                              style={{ background: 'none', color: '#6366f1', width: 'auto', padding: 0, fontSize: '0.875rem', fontWeight: 500 }}
                            >
                              Editar
                            </button>
                          )}
                          {userRole === 'admin' && (
                            <button 
                              onClick={() => handleDelete(record.id)}
                              style={{ background: 'none', color: '#ef4444', width: 'auto', padding: 0, fontSize: '0.875rem', fontWeight: 500 }}
                            >
                              Eliminar
                            </button>
                          )}
                          {userRole === 'viewer' && <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>Solo lectura</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="pagination">
              <button 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)}
              >
                Anterior
              </button>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>
                Página {page} de {totalPages || 1}
              </p>
              <button 
                disabled={page === totalPages || totalPages === 0} 
                onClick={() => setPage(p => p + 1)}
              >
                Siguiente
              </button>
            </footer>
          </>
        ) : (
          <div className="empty-state">
            <svg style={{ width: '48px', height: '48px', marginBottom: '1rem', opacity: 0.2 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3>No se encontraron resultados</h3>
            <p>Intenta ajustar tu búsqueda o los filtros para encontrar lo que buscas.</p>
            {(search || category) && (
              <button 
                onClick={() => { setSearch(''); setCategory(''); }}
                style={{ width: 'auto', padding: '0.5rem 1rem', marginTop: '1rem', background: '#94a3b8' }}
              >
                Limpiar Filtros
              </button>
            )}
          </div>
        )}
      </div>

      <RecordModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchRecords}
        recordToEdit={selectedRecord}
      />
    </div>
  );
};

export default RecordsPage;
