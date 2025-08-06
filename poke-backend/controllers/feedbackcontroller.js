const db = require('../models/db');

// Obtener comentarios de un Pokémon con nombre de usuario y reacciones
exports.getComments = async (req, res) => {
  const { pokemonId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT f.id, f.id_usuario, f.id_pokemon, f.comentario, f.fecha, u.nombre_entrenador,
              (SELECT COUNT(*) FROM reacciones r WHERE r.id_feedback = f.id AND r.tipo = 1) AS likes,
              (SELECT COUNT(*) FROM reacciones r WHERE r.id_feedback = f.id AND r.tipo = 2) AS dislikes
       FROM feedbacks f
       JOIN usuarios u ON f.id_usuario = u.id
       WHERE f.id_pokemon = ?
       ORDER BY f.fecha DESC`,
      [pokemonId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener comentarios', err);
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
};

// Agregar nuevo comentario
exports.addComment = async (req, res) => {
  const { pokemonId } = req.params;
  const { text } = req.body;
  const rawHeader = req.headers.usuario;

  console.log('Header recibido:', rawHeader);

  let userId;

  try {
    if (typeof rawHeader === 'string' && rawHeader.startsWith('{')) {
      const parsed = JSON.parse(rawHeader);
      userId = parsed.id;
    } else {
      userId = parseInt(rawHeader, 10);
    }
  } catch {
    userId = null;
  }

  if (!text || !userId || isNaN(userId)) {
    console.warn('Datos inválidos al agregar comentario', { text, userId });
    return res.status(400).json({ error: 'Falta comentario o ID de usuario válido' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO feedbacks (id_usuario, id_pokemon, comentario) VALUES (?, ?, ?)',
      [userId, pokemonId, text]
    );

    const [newComment] = await db.execute(
      `SELECT f.id, f.id_usuario, f.id_pokemon, f.comentario, f.fecha, u.nombre_entrenador,
              0 AS likes,
              0 AS dislikes
       FROM feedbacks f
       JOIN usuarios u ON f.id_usuario = u.id
       WHERE f.id = ?`,
      [result.insertId]
    );

    res.json(newComment[0]);
  } catch (err) {
    console.error('Error al agregar comentario', err);
    res.status(500).json({ error: 'Error al agregar comentario' });
  }
};

// Reaccionar a un comentario
exports.reactToComment = async (req, res) => {
  const { commentId } = req.params;
  const { type } = req.body;
  const rawHeader = req.headers.usuario;

  let userId;

  try {
    if (typeof rawHeader === 'string' && rawHeader.startsWith('{')) {
      const parsed = JSON.parse(rawHeader);
      userId = parsed.id;
    } else {
      userId = parseInt(rawHeader, 10);
    }
  } catch {
    userId = null;
  }

  const tipo = type === 'likes' ? 1 : type === 'dislikes' ? 2 : 0;

  if (!userId || !tipo || isNaN(userId)) {
    return res.status(400).json({ error: 'Datos inválidos en reacción' });
  }

  try {
    await db.execute(
      `INSERT INTO reacciones (id_usuario, id_feedback, tipo)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE tipo = VALUES(tipo)`,
      [userId, commentId, tipo]
    );

    const [[likeCount]] = await db.execute(
      `SELECT COUNT(*) AS total FROM reacciones WHERE id_feedback = ? AND tipo = 1`,
      [commentId]
    );
    const [[dislikeCount]] = await db.execute(
      `SELECT COUNT(*) AS total FROM reacciones WHERE id_feedback = ? AND tipo = 2`,
      [commentId]
    );

    res.json({
      id: commentId,
      likes: likeCount.total,
      dislikes: dislikeCount.total
    });
  } catch (err) {
    console.error('Error al reaccionar', err);
    res.status(500).json({ error: 'Error al reaccionar' });
  }
};
