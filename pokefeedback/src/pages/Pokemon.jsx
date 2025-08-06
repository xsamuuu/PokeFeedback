// src/pages/Pokemon.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPokemonById } from '@/api/getPokemonById';
import PokemonDetails from '@/components/PokemonDetails';
import '@/css/PokemonDetails.css'; // Asegúrate de importar este CSS


export default function Pokemon() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [primaryType, setPrimaryType] = useState('normal');

  useEffect(() => {
    async function fetchData() {
      const data = await getPokemonById(id);
      setPokemon(data);

      const firstType = data?.types?.[0]?.type?.name || 'normal';
      setPrimaryType(firstType);
    }

    fetchData();
  }, [id]);

  if (!pokemon) {
    return (
      <div className="pokemon-page">
        <div className="pokemon-loading">Cargando Pokémon...</div>
      </div>
    );
  }

  return (
    <div className={`pokemon-page bg-${primaryType}`}>
      <div className={`pokemon-card-container border-${primaryType}`}>
       <PokemonDetails data={pokemon} /> 
      </div>
      
    </div>
    
  );
}