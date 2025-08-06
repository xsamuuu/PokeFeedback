import { useState } from 'react';
import '@/css/search.css';

const tiposPokemon = [
  'normal', 'fuego', 'agua', 'planta', 'eléctrico', 'hielo', 'lucha', 'veneno',
  'tierra', 'volador', 'psíquico', 'bicho', 'roca', 'fantasma', 'siniestro',
  'dragón', 'acero', 'hada',
];

const rarezas = [
  { value: 'comun', label: 'Común' },
  { value: 'legendario', label: 'Legendario' }
];

export default function Search({ onFilter }) {
  const [nombre, setNombre] = useState('');
  const [id, setId] = useState('');
  const [tipo, setTipo] = useState('');
  const [rareza, setRareza] = useState('');

  const handleSearch = () => {
    onFilter({
      nombre,
      id,
      tipo,
      rareza
    });
  };

  return (
    <div className="search-container" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="number"
        placeholder="ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        min="1"
      />
      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="">Tipo</option>
        {tiposPokemon.map(tipo => (
          <option key={tipo} value={tipo}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</option>
        ))}
      </select>
      <select value={rareza} onChange={(e) => setRareza(e.target.value)}>
        <option value="">Rareza</option>
        {rarezas.map(r => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>

      <button onClick={handleSearch} style={{ padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
        Buscar
      </button>
    </div>
  );
}
