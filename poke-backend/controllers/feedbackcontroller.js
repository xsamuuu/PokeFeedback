// controllers/feedbackController.js
const db = require('../models/db');

exports.getComments = async (req, res) => {
  const { pokemonId } = req.params;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM feedbacks WHERE id_pokemon = ? ORDER BY fecha DESC',
      [pokemonId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener comentarios', err);
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
};

exports.addComment = async (req, res) => {
  const { pokemonId } = req.params;
  const { text } = req.body;
  const user = req.headers['usuario']; // Asegúrate de pasar el ID desde el frontend

  if (!text || !user) {
    return res.status(400).json({ error: 'Falta comentario o ID de usuario' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO feedbacks (id_usuario, id_pokemon, comentario) VALUES (?, ?, ?)',
      [user, pokemonId, text]
    );

    const [newCommentRows] = await db.execute('SELECT * FROM feedbacks WHERE id = ?', [result.insertId]);
    res.json(newCommentRows[0]);
  } catch (err) {
    console.error('Error al agregar comentario', err);
    res.status(500).json({ error: 'Error al agregar comentario' });
  }
};

exports.reactToComment = async (req, res) => {
  const { pokemonId, commentId } = req.params;
  const { type } = req.body;

  let reaccion = 0;
  if (type === 'likes') reaccion = 1;
  else if (type === 'dislikes') reaccion = 2;

  try {
    await db.execute(
      'UPDATE feedbacks SET reaccion = ? WHERE id = ? AND id_pokemon = ?',
      [reaccion, commentId, pokemonId]
    );

    const [updated] = await db.execute('SELECT * FROM feedbacks WHERE id = ?', [commentId]);
    res.json(updated[0]);
  } catch (err) {
    console.error('Error al reaccionar al comentario', err);
    res.status(500).json({ error: 'Error al reaccionar al comentario' });
  }
};
