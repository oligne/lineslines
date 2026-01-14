import React, { useState } from 'react';

export default function UserPopup({ user, me, onClose, small, showPseudo, onCreateRelation, isLinked }) {
  let keywordsArr = [];
  if (Array.isArray(user.keywords)) {
    keywordsArr = user.keywords;
  } else if (typeof user.keywords === 'string' && user.keywords.length > 0) {
    keywordsArr = user.keywords.split(',').map(k => k.trim()).filter(Boolean);
  }
  const [keywords, setKeywords] = useState(keywordsArr);
  const [keywordEdit, setKeywordEdit] = useState("");
  const [loading, setLoading] = useState(false);

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
      marginBottom: 0,
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
                width: 60
              }}
              maxLength={16}
              placeholder="+ keyword"
              disabled={loading}
            />
            {loading && <span style={{ marginLeft: 4, fontSize: 10 }}>⏳</span>}
          </>
        )}
      </div>
      {/* Bouton lier (à adapter selon logique de liens) */}
      {onCreateRelation && !isLinked && me?.id !== user.id && (
        <button onClick={onCreateRelation} style={{
          marginTop: 10,
          fontSize: 15,
          background: '#e22',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '6px 18px',
          cursor: 'pointer',
          fontFamily: 'Menlo',
          fontWeight: 700
        }}>lier nos points</button>
      )}
      {isLinked && me?.id !== user.id && (
        <div style={{marginTop: 10, color: '#0a0', fontWeight: 700, fontSize: 15}}>déjà liés</div>
      )}
    </div>
  );
}
