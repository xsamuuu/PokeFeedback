const express = require('express');
const router = express.Router();
const db = require('../models/db'); // Ajusta según tu conexión a la base de datos
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// LOGIN

router.post('/register', async (req, res) => {
  const { nombre_entrenador, contrasena } = req.body;
  if (!nombre_entrenador || !contrasena) {
    return res.status(400).json({ error: 'Campos requeridos' });
  }
  try {
    // Verifica que el usuario no exista
    const [rows] = await db.query(
      'SELECT * FROM usuarios WHERE nombre_entrenador = ?',
      [nombre_entrenador]
    );
    if (rows.length > 0) {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }
    // Hashea la contraseña
    const hash = await bcrypt.hash(contrasena, 10);
    await db.query(
      'INSERT INTO usuarios (nombre_entrenador, contrasena) VALUES (?, ?)',
      [nombre_entrenador, hash]
    );
    res.json({ success: true, message: 'Registro exitoso' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/login', async (req, res) => {
  const { nombre_entrenador, contrasena } = req.body;
  try {
    const [rows] = await db.query(
      'SELECT * FROM usuarios WHERE nombre_entrenador = ?',
      [nombre_entrenador]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    const usuario = rows[0];
    const match = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    // Genera token JWT
    const token = jwt.sign(
      { id: usuario.id, nombre_entrenador: usuario.nombre_entrenador },
      process.env.JWT_SECRET || 'SECRET_KEY',
      { expiresIn: '1d' }
    );
    res.json({
      success: true,
      token,
      usuario: { id: usuario.id, nombre_entrenador: usuario.nombre_entrenador }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;