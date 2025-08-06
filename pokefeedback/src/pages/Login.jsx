import { useState } from 'react';
import '@/css/LoginPokemon.css';

export default function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulación de login (puedes conectar con backend después)
    if (user.trim() === '' || pass.trim() === '') {
      setError('¡Debes ingresar usuario y contraseña!');
    } else {
      setError('');
      // Aquí va la lógica real de login
      alert(`Bienvenido, ${user}!`);
    }
  };

  return (
    <div className="pokemon-login-bg">
      <div className="pokemon-login-card">
        <div className="pokemon-login-header">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png" alt="Pokeball" className="pokeball-img" />
          <h1 className="pokemon-login-title">Pokémon Login</h1>
        </div>
        <form className="pokemon-login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Entrenador"
            value={user}
            onChange={e => setUser(e.target.value)}
            className="pokemon-input"
            autoFocus
          />
          <input
            type="password"
            placeholder="Contraseña Secreta"
            value={pass}
            onChange={e => setPass(e.target.value)}
            className="pokemon-input"
          />
          {error && <div className="pokemon-error">{error}</div>}
          <button className="pokemon-btn" type="submit">
            ¡Atrápalo!
          </button>
        </form>
      </div>
    </div>
  );
}