// src/components/FeedbackSection.jsx
import { useState } from 'react';
import '@/css/FeedbackSection.css'; 
export default function FeedbackSection({ pokemonId }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleAddComment = () => {
    if (input.trim() === '') return;
    setComments([
      ...comments,
      {
        id: Date.now(),
        text: input,
        likes: 0,
        dislikes: 0
      }
    ]);
    setInput('');
  };

  const handleReaction = (commentId, type) => {
    setComments(comments.map(c =>
      c.id === commentId
        ? { ...c, [type]: c[type] + 1 }
        : c
    ));
  };

  return (
    <div className={`feedback-horizontal-container`}>
      <div
        className={`feedback-horizontal-panel ${expanded ? 'expanded' : ''}`}
      >
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
          <div className="feedback-list">
            {comments.length === 0 && (
              <div className="no-feedback">Sé el primero en comentar!</div>
            )}
            {comments.map(comment => (
              <div key={comment.id} className="feedback-comment">
                <span>{comment.text}</span>
                <div className="feedback-actions">
                  <button onClick={() => handleReaction(comment.id, 'likes')}>
                    👍 {comment.likes}
                  </button>
                  <button onClick={() => handleReaction(comment.id, 'dislikes')}>
                    👎 {comment.dislikes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Botón flotante para mostrar la sección cuando está oculta */}
      {!expanded && (
        <button
          className="feedback-float-btn"
          onClick={() => setExpanded(true)}
        >
          💬
        </button>
      )}
    </div>
  );
}