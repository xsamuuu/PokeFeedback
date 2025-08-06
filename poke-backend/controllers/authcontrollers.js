const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  const { username, password } = req.body;

  if (!(username && password)) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const hash = bcrypt.hashSync(password, 10);

  db.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hash],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al registrar' });
      res.status(201).json({ message: 'Usuario creado' });
    }
  );
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const user = results[0];
      const isValid = bcrypt.compareSync(password, user.password);

      if (!isValid) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '2h'
      });

      res.json({ message: 'Login exitoso', token });
    }
  );
};
