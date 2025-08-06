import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '@/css/PokemonCardTCG.css';

export default function PokemonCardTCG({ id, name, imageUrl }) {
  const [type, setType] = useState('normal');

  useEffect(() => {
    async function fetchType() {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await res.json();
        const primaryType = data.types[0]?.type?.name || 'normal';
        setType(primaryType);
      } catch (err) {
        console.error(`Error fetching type for ${name}`, err);
      }
    }

    fetchType();
  }, [id, name]);

  const typeClass = `tcg-border-${type.toLowerCase()}`;

  return (
    <Link to={`/pokemon/${id}`} className={`tcg-card ${typeClass}`}>
      <div className="">
        <div className="tcg-card-header">
          <span className="tcg-card-type">{type.toUpperCase()}</span>
          <span className="tcg-card-id">#{id}</span>
        </div>

        <div className="tcg-card-image">
          <img src={imageUrl} alt={name} className="tcg-img" />
        </div>

        <div className="tcg-info">
          <div className="tcg-name">{name}</div>
        </div>
      </div>
    </Link>
  );
}
