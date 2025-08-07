// src/routes/routes.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Pokemon from '@/pages/Pokemon';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import { ROUTES } from '@/enum/routes';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.POKEMON_DETAIL} element={<Pokemon />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
      </Routes>
    </Router>
  );
}
