// src/components/PokemonDetails.jsx
import '@/css/PokemonDetailsComponent.css';

export default function PokemonDetails({ data }) {
  return (
    <div className="pokemon-container">
      <h1 className="pokemon-title">{data.name}</h1>
      <img
        src={data.sprites.front_default}
        alt={data.name}
        className="pokemon-image"
      />
      <p className="pokemon-id">ID: {data.id}</p>
      <div style={{ marginTop: '1rem' }}>
        <h2 className="pokemon-subtitle">Tipos:</h2>
        <ul className="pokemon-types">
         
          {data.types.map((type) => (
            <li key={type.type.name} className="pokemon-type">
              {type.type.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
