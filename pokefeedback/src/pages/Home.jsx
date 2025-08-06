import { useEffect, useState } from 'react';
import { getPokemonList } from '@/api/getPokemonList';
import { getPokemonCard } from '@/api/getPokemonCard';
import PokemonCardTCG from '@/components/PokemonCardTCG';
import Search from '@/components/Search';
import '@/css/Home.css';
import '@/css/PokemonCardTCG.css';

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [cards, setCards] = useState({});
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ nombre: '', id: '', tipo: '', rareza: '' });
  const limit = 20;

  const allowedNames = [
    "bulbasaur", "ivysaur", "venusaur", "charmander", "charmeleon", "charizard",
    "squirtle", "wartortle", "blastoise", "caterpie", "metapod", "butterfree",
    "weedle", "kakuna", "beedrill", "pidgey", "pidgeotto", "pidgeot", "rattata", "raticate"
  ];

  useEffect(() => {
    async function fetchData() {
      const list = await getPokemonList(page * limit, limit);
      setPokemons(list);

      const cardData = {};
      const fetchPromises = list.map(async (pokemon) => {
        const name = pokemon.name.toLowerCase();
        if (allowedNames.includes(name)) {
          const image = await getPokemonCard(name);
          if (image) cardData[name] = image;
        }
      });

      await Promise.all(fetchPromises);
      setCards({ ...cardData });
    }

    fetchData();
  }, [page]);

  // Filtrado básico por nombre e ID
  const filteredPokemons = pokemons.filter(pokemon => {
    const name = pokemon.name.toLowerCase();
    const id = pokemon.url.split('/').filter(Boolean).pop();

    const matchesName = filters.nombre === '' || name.includes(filters.nombre.toLowerCase());
    const matchesId = filters.id === '' || id === filters.id;

    // Nota: tipo y rareza podrían usarse si se tienen los datos de cada Pokémon.
    return matchesName && matchesId;
  });

  return (
    <div className="home-container">
      <h1 className="home-title">Pokémon List</h1>

      {/* Buscador */}
      <Search onFilter={setFilters} />

      {/* Lista de Pokémon */}
      <div className="pokemon-grid">
        {filteredPokemons.map((pokemon) => {
          const id = pokemon.url.split('/').filter(Boolean).pop();
          const name = pokemon.name.toLowerCase();
          const cardImage = cards[name];
          const spriteImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

          return (
            <PokemonCardTCG
              key={name}
              id={id}
              name={name}
              imageUrl={cardImage || spriteImage}
            />
          );
        })}
      </div>

      {/* Navegación */}
      <div className="nav-buttons">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          Anterior
        </button>
        <button onClick={() => setPage((prev) => prev + 1)}>
          Siguiente
        </button>
      </div>
    </div>
  );
}
