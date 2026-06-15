import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save, Truck } from 'lucide-react';

const ProveedorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [activo, setActivo] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchProveedor = async () => {
        try {
          const response = await api.get(`/proveedores/${id}`);
          setNombre(response.data.nombre);
          setTelefono(response.data.telefono || '');
          setEmail(response.data.email || '');
          setEmpresa(response.data.empresa || '');
          setActivo(response.data.activo);
        } catch (error) {
          setError('Error al cargar el proveedor.');
        }
      };
      fetchProveedor();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const data = { nombre, telefono, email, empresa, activo };
    try {
      if (isEditMode) {
        await api.put(`/proveedores/${id}`, data);
      } else {
        await api.post('/proveedores', data);
      }
      navigate('/proveedores');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/proveedores" className="text-gray-500 hover:text-green-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Truck className="h-6 w-6 text-green-500" />
        <h1 className="text-2xl font-bold text-white">{isEditMode ? 'Editar Proveedor' : 'Crear Proveedor'}</h1>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        {error && <div className="bg-red-900/20 border border-red-800/30 text-red-400 p-3 rounded-xl mb-6 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Nombre del Proveedor</label>
            <input type="text" required maxLength={100} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Distribuidora La Estrella" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Empresa</label>
            <input type="text" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Ej: La Estrella SRL" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Teléfono</label>
            <input type="text" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Ej: 3454-123456" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
            <input type="email" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ej: contacto@laestrella.com" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="activo" checked={activo} onChange={(e) => setActivo(e.target.checked)} className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-green-600 focus:ring-green-500" />
            <label htmlFor="activo" className="text-sm font-medium text-gray-400">Proveedor activo</label>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/proveedores')} className="bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors text-sm font-medium">Cancelar</button>
            <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors text-sm font-medium flex items-center disabled:opacity-50">
              <Save className="h-4 w-4 mr-1.5" />
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProveedorForm;