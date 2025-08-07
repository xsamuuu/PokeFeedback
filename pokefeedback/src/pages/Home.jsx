import { useEffect, useState } from 'react';
import { getPokemonList } from '@/api/getPokemonList';
import { getPokemonCard } from '@/api/getPokemonCard';
import PokemonCardTCG from '@/components/PokemonCardTCG';
import Search from '@/components/Search';
import '@/css/Home.css';
import '@/css/PokemonCardTCG.css';
import LogoutButton from '@/components/LogoutButton';



// Diccionario español-inglés para tipos
const tipoTraducido = {
  normal: "normal",
  fuego: "fire",
  agua: "water",
  planta: "grass",
  eléctrico: "electric",
  hielo: "ice",
  lucha: "fighting",
  veneno: "poison",
  tierra: "ground",
  volador: "flying",
  psíquico: "psychic",
  bicho: "bug",
  roca: "rock",
  fantasma: "ghost",
  siniestro: "dark",
  dragón: "dragon",
  acero: "steel",
  hada: "fairy"
};

// Lista de legendarios, puedes añadir más
const legendarios = ['mewtwo', 'mew', 'articuno', 'zapdos', 'moltres'];

const LIMIT_TOTAL = 151; // Por ejemplo, los 151 primeros Pokémon

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [cards, setCards] = useState({});
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ nombre: '', id: '', tipo: '', rareza: '' });
  const limit = 20;

  useEffect(() => {
    async function fetchData() {
      // Obtén TODOS los Pokémon en un solo fetch
      const list = await getPokemonList(0, LIMIT_TOTAL);

      // Obtén tipo y rareza para cada uno
      const detailedList = await Promise.all(
        list.map(async (pokemon) => {
          const id = pokemon.url.split('/').filter(Boolean).pop();
          try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await res.json();
            const primaryType = data.types[0]?.type?.name.toLowerCase() || 'normal'; // En minúsculas
            const name = data.name.toLowerCase();
            const rareza = legendarios.includes(name) ? 'legendario' : 'comun';
            return { ...pokemon, type: primaryType, rareza };
          } catch (e) {
            return { ...pokemon, type: 'normal', rareza: 'comun' };
          }
        })
      );
      setPokemons(detailedList);

      // Carga imágenes
      const cardData = {};
      const fetchPromises = detailedList.map(async (pokemon) => {
        const name = pokemon.name.toLowerCase();
        const image = await getPokemonCard(name);
        if (image) cardData[name] = image;
      });
      await Promise.all(fetchPromises);
      setCards({ ...cardData });
    }
    fetchData();
  }, []);

  // Filtrado GENERAL: sobre toda la lista
  const filteredPokemons = pokemons.filter(pokemon => {
    const name = pokemon.name.toLowerCase();
    const id = pokemon.url.split('/').filter(Boolean).pop();
    const matchesName = filters.nombre === '' || name.includes(filters.nombre.toLowerCase());
    const matchesId = filters.id === '' || id === filters.id;

    // Traduce el tipo del filtro al inglés para comparar con el dato de la API
    const tipoFiltro = filters.tipo ? tipoTraducido[filters.tipo] : '';
    const matchesTipo = tipoFiltro === '' || pokemon.type === tipoFiltro;

    const matchesRareza = filters.rareza === '' || pokemon.rareza === filters.rareza;

    return matchesName && matchesId && matchesTipo && matchesRareza;
  });

  // PAGINADO SOLO DE VISUALIZACIÓN
  const paginatedPokemons = filteredPokemons.slice(page * limit, (page + 1) * limit);

  return (
    <div className="home-container">
      <h1 className="home-title">Poke feedback</h1>
      <img className='ultraball' src="./src/components/imgs/ultra-ball.png" alt="ultraball logo"  />
      <Search onFilter={setFilters} />
      <div className="pokemon-grid">
        {paginatedPokemons.map((pokemon) => {
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
      <div className="nav-buttons">
        <button className='back-btn'
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          Anterior
        </button>
        <button className='next-btn'
          onClick={() => setPage((prev) => prev + 1)}
          disabled={(page + 1) * limit >= filteredPokemons.length}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}