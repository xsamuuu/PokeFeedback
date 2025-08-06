import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '@/css/LoginPokemon.css';

export default function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirige si ya hay token al Home
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.trim() === '' || pass.trim() === '') {
      setError('¡Debes ingresar usuario y contraseña!');
    } else {
      try {
        const res = await axios.post('http://localhost:3001/api/auth/login', {
          nombre_entrenador: user,
          contrasena: pass
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
        setError('');
        alert(`Bienvenido, ${res.data.usuario.nombre_entrenador}!`);
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.error || 'Usuario o contraseña incorrectos');
      }
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