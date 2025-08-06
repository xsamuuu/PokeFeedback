import { useState, useEffect } from 'react';
import axios from 'axios';
import '@/css/FeedbackSection.css';

export default function FeedbackSection({ pokemonId }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
  const [expanded, setExpanded] = useState(false);

  const usuarioId = localStorage.getItem('usuario');

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/feedback/${pokemonId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error al obtener comentarios', err);
    }
  };

  const handleAddComment = async () => {
    if (input.trim() === '' || !usuarioId) {
      console.warn('No se puede comentar: entrada vacía o usuario no definido');
      return;
    }

    try {
      console.log('Enviando comentario:', { pokemonId, input, usuarioId });

      const res = await axios.post(
        `http://localhost:3001/api/feedback/${pokemonId}`,
        { text: input },
        { headers: { usuario: usuarioId } }
      );

      setComments(prev => [res.data, ...prev]);
      setInput('');
    } catch (err) {
      console.error('Error al agregar comentario', err);
    }
  };

  const handleReaction = async (commentId, type) => {
    try {
      const res = await axios.post(
        `http://localhost:3001/api/feedback/${pokemonId}/react/${commentId}`,
        { type },
        { headers: { usuario: usuarioId } }
      );

      setComments(prev =>
        prev.map(c =>
          c.id === commentId
            ? { ...c, likes: res.data.likes, dislikes: res.data.dislikes }
            : c
        )
      );
    } catch (err) {
      console.error('Error al reaccionar al comentario', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [pokemonId]);

  return (
    <div className="feedback-horizontal-container">
      <div className={`feedback-horizontal-panel ${expanded ? 'expanded' : ''}`}>
        <div className="feedback-header-horizontal">
          <span className="feedback-title">Comentarios</span>
          <button
            className="feedback-toggle-btn-horizontal"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '⇦ Ocultar' : '⇨ Mostrar'}
          </button>
        </div>

        <div className="feedback-body-horizontal">
          {usuarioId && (
            <div className="feedback-input">
              <input
                type="text"
                value={input}
                placeholder="Agrega tu comentario..."
                onChange={e => setInput(e.target.value)}
                maxLength={120}
              />
              <button onClick={handleAddComment}>Comentar</button>
            </div>
          )}

          <div className="feedback-list">
            {comments.length === 0 && (
              <div className="no-feedback">¡Sé el primero en comentar!</div>
            )}
            {comments.map(comment => (
              <div key={comment.id} className="feedback-comment">
                <div className="feedback-user">@{comment.nombre_entrenador}</div>
                <div className="feedback-text">{comment.comentario}</div>
                <div className="feedback-actions">
                  <button onClick={() => handleReaction(comment.id, 'likes')}>
                    👍 {comment.likes > 0 && comment.likes}
                  </button>
                  <button onClick={() => handleReaction(comment.id, 'dislikes')}>
                    👎 {comment.dislikes > 0 && comment.dislikes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!expanded && (
        <button className="feedback-float-btn" onClick={() => setExpanded(true)}>
          💬
        </button>
      )}
    </div>
  );
}
