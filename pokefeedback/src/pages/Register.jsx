import { useState } from 'react';
import '@/css/RegisterPokemon.css';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nombre.trim() === '' || pass.trim() === '') {
      setError('¡Debes ingresar tu nombre de entrenador y una contraseña!');
      setSuccess('');
    } else if (nombre.trim().length < 3) {
      setError('¡El nombre de entrenador debe tener al menos 3 caracteres!');
      setSuccess('');
    } else if (pass.trim().length < 4) {
      setError('¡La contraseña debe tener al menos 4 caracteres!');
      setSuccess('');
    } else {
      setError('');
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      // Aquí iría la lógica real de registro (API, localStorage, etc.)
    }
  };

  return (
    <div className="pokemon-register-bg">
      <div className="pokemon-register-card">
        <div className="pokemon-register-header">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png" alt="Pokeball" className="pokeball-img" />
          <h1 className="pokemon-register-title">Registro Pokémon</h1>
        </div>
        <form className="pokemon-register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre de entrenador"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="pokemon-input"
            autoFocus
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={pass}
            onChange={e => setPass(e.target.value)}
            className="pokemon-input"
          />
          {error && <div className="pokemon-error">{error}</div>}
          {success && <div className="pokemon-success">{success}</div>}
          <button className="pokemon-btn" type="submit">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}