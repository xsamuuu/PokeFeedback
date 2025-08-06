import { useState } from 'react';
import axios from 'axios';
import '@/css/LoginPokemon.css';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nombre.trim() === '' || pass.trim() === '') {
      setError('¡Debes ingresar usuario y contraseña!');
      setSuccess('');
    } else {
      try {
        const res = await axios.post('http://localhost:3001/api/auth/register', {
          nombre_entrenador: nombre,
          contrasena: pass
        });
        setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
        setError('');
        setNombre('');
        setPass('');
        // Opcional: redirigir al login después de unos segundos
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } catch (err) {
        setError(err.response?.data?.error || 'Error al registrar');
        setSuccess('');
      }
    }
  };

  return (
    <div className="pokemon-login-bg">
      <div className="pokemon-login-card">
        <div className="pokemon-login-header">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png" alt="Pokeball" className="pokeball-img" />
          <h1 className="pokemon-login-title">Registrarse</h1>
        </div>
        <form className="pokemon-login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nuevo entrenador"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
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
          {success && <div className="pokemon-success">{success}</div>}
          <button className="pokemon-btn" type="submit">
            ¡Registrarse!
          </button>
        </form>
      </div>
    </div>
  );
}