import React, { useState } from 'react';
import lieIcon from '../assets/icons/lie.png';
import delieIcon from '../assets/icons/delie.png';

export default function UserPopup({ user, me, relations, onClose, small, showPseudo, onCreateRelation, onDeleteRelation, isLinkedReverse }) {
  let keywordsArr = [];
  if (Array.isArray(user.keywords)) {
    keywordsArr = user.keywords;
  } else if (typeof user.keywords === 'string' && user.keywords.length > 0) {
    keywordsArr = user.keywords.split(',').map(k => k.trim()).filter(Boolean);
  }
  const [keywords, setKeywords] = useState(keywordsArr);
  const [keywordEdit, setKeywordEdit] = useState("");
  const [loading, setLoading] = useState(false);

  // Calcule isLinked à chaque render, en forçant la comparaison en string
  const isLinked = !!relations?.find(r => String(r.user1_id) === String(me?.id) && String(r.user2_id) === String(user.id));

  async function handleKeywordAdd() {
    if (!keywordEdit.trim() || keywords.length >= 3) return;
    const newKeywords = [...keywords, keywordEdit.trim()].slice(0, 3);
    setLoading(true);
    try {
      await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ keywords: newKeywords }),
        headers: { 'Content-Type': 'application/json' },
      });
      setKeywords(newKeywords);
      setKeywordEdit("");
    } finally {
      setLoading(false);
    }
  }
  async function handleKeywordRemove(idx) {
    const newKeywords = keywords.filter((_, i) => i !== idx);
    setLoading(true);
    try {
      await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ keywords: newKeywords }),
        headers: { 'Content-Type': 'application/json' },
      });
      setKeywords(newKeywords);
    } finally {
      setLoading(false);
    }
  }
  const displayName = user?.pseudo || user?.label || '';
  return (
    <div className={small ? 'user-popup-small' : 'user-popup'} style={{
      position: 'relative',
      background: '#fff',
      border: '1px solid #ddd',
      borderRadius: 12,
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      padding: small ? '20px 28px 18px 28px' : '20px 28px 18px 28px',
      width: 320,
      minWidth: 320,
      maxWidth: 320,
      fontFamily: 'Menlo, monospace',
      fontSize: small ? 16 : 20,
      marginBottom: -20,
      marginTop: 20,
      pointerEvents: 'auto',
      zIndex: 1,
      boxSizing: 'border-box',
      overflow: 'visible'
    }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 4, right: 8, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
      <div style={{ fontWeight: 700, fontSize: small ? 16 : 20, marginBottom: 4, fontFamily: 'Menlo' }}>
        {showPseudo ? `/user/${user?.pseudo || user?.label || ''}` : `/user/${user?.id}`}
      </div>
      <div style={{ marginBottom: small ? 6 : 12, fontSize: small ? 12 : 17 }}>
        {keywords.length > 0 ? keywords.map((kw, i) => (
          <span key={i} style={{ marginRight: 4, background: '#eee', borderRadius: 8, padding: '1px 7px', fontWeight: 600, fontSize: small ? 12 : 15 }}>
            {kw}
            {me && me.id === user.id && (
              <span style={{ color: '#e22', marginLeft: 4, cursor: 'pointer' }} onClick={() => handleKeywordRemove(i)}>&times;</span>
            )}
            {i < keywords.length - 1 ? ',' : ''}
          </span>
        )) : <span style={{ color: '#bbb' }}>Aucun mot-clé</span>}
        {me && me.id === user.id && keywords.length < 3 && (
          <>
            <input
              value={keywordEdit}
              onChange={e => setKeywordEdit(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleKeywordAdd(); }}
              style={{
                fontFamily: 'Menlo',
                fontSize: small ? 12 : 16,
                border: 'none',
                outline: 'none',
                background: 'none',
                borderBottom: '2px solid #111',
                marginLeft: 6,
                width: 180
              }}
              maxLength={16}
              placeholder="+ keyword"
              disabled={loading}
            />
            {loading && <span style={{ marginLeft: 4, fontSize: 10 }}>⏳</span>}
          </>
        )}
      </div>
      {/* Bouton lier/délier (icônes personnalisées) */}
      {onCreateRelation && !isLinked && me?.id !== user.id && (
        <button onClick={() => { console.log('LIAISON', me?.id, user.id); onCreateRelation(); }} style={{
          marginTop: 16,
          background: '#fff',
          border: 'none',
          borderRadius: 10,
          padding: '7px 7px 7px 18px',
          minWidth: 180,
          height: 48,
          width: '100%',
          cursor: 'pointer',
          fontFamily: 'Menlo',
          fontWeight: 700,
          fontSize: 18,
          color: '#111',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          transition: 'background 0.15s, color 0.15s',
          whiteSpace: 'nowrap',
        }}
        onMouseOver={e => { e.currentTarget.style.background = '#eee'; }}
        onMouseOut={e => { e.currentTarget.style.background = '#fff'; }}
        >
          <img src={lieIcon.src} alt="lier" style={{ width: 47, height: 22, marginRight: 10 }} />
          lier nos points
        </button>
      )}
      {isLinked && me?.id !== user.id && (
        <button onClick={() => { console.log('DELIER', me?.id, user.id); onDeleteRelation && onDeleteRelation(user.id); }} style={{
          marginTop: 16,
          background: '#fff',
          border: 'none',
          borderRadius: 10,
          padding: '7px 7px 7px 18px',
          minWidth: 180,
          height: 48,
          width: '100%',
          cursor: 'pointer',
          fontFamily: 'Menlo',
          fontWeight: 700,
          fontSize: 18,
          color: '#111',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          transition: 'background 0.15s, color 0.15s',
          whiteSpace: 'nowrap',
        }}
        onMouseOver={e => { e.currentTarget.style.background = '#eee'; }}
        onMouseOut={e => { e.currentTarget.style.background = '#fff'; }}
        >
          <img src={delieIcon.src} alt="délier" style={{ width: 47, height: 22, marginRight: 10 }} />
          délier nos points
        </button>
      )}
      {/* Message if only reverse link exists, below button */}
      {isLinkedReverse && !isLinked && me?.id !== user.id && (
        <div style={{ textAlign: 'center', fontFamily: 'Menlo', fontSize: 15, color: '#222', fontWeight: 600, opacity: 0.45, marginTop: 10 }}>
          {user.pseudo || user.label || user.id} vous lie encore
        </div>
      )}
      {/* Affiche l'icône et le texte si le lien subsiste dans l'autre sens */}
      {relations && relations.find(r => r.user1_id === user.id && r.user2_id === me?.id) && me?.id !== user.id && (
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10, gap: 8 }}>
          {/* Icône diagramme de Venn (SVG) */}
          <svg width="32" height="20" viewBox="0 0 32 20" style={{ marginRight: 4 }}>
            <circle cx="12" cy="10" r="8" fill="#bbb" fillOpacity="0.5" />
            <circle cx="20" cy="10" r="8" fill="#111" fillOpacity="0.5" />
          </svg>
          <span style={{ fontFamily: 'Menlo', fontSize: 15, color: '#222', fontWeight: 600 }}>
            {user.pseudo || user.label || user.id} est encore lié à votre point
          </span>
        </div>
      )}
      {/* Message if both users are linked (reciproque) */}
      {isLinked && relations?.find(r => String(r.user1_id) === String(user.id) && String(r.user2_id) === String(me?.id)) && me?.id !== user.id && (
        <div style={{ textAlign: 'center', fontFamily: 'Menlo', fontSize: 15, color: '#222', fontWeight: 600, opacity: 0.45, marginTop: 10 }}>
          Vous êtes tous les deux liés
        </div>
      )}
    </div>
  );
}
