// src/pages/Pokemon.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPokemonById } from '@/api/getPokemonById';
import PokemonDetails from '@/components/PokemonDetails';

export default function Pokemon() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getPokemonById(id);
      setPokemon(data);
    }

    fetchData();
  }, [id]);

  if (!pokemon) return <div className="p-4 text-center">Cargando...</div>;

  return (
    <div className="p-4">
      <PokemonDetails data={pokemon} />
    </div>
  );
}
