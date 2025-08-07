// src/components/LogoutButton.jsx
import { useNavigate } from 'react-router-dom';
import '@/css/LogoutButton.css';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="pokemon-btn2">
      Cerrar sesión
    </button>
  );
}
