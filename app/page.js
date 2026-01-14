// Page principale
'use client';
import { useEffect, useState, useRef } from 'react';
import { getUserPositions } from '../lib/forceGraph';
import dynamic from 'next/dynamic';

const ForceGraph3DView = dynamic(() => import('../lib/ForceGraph3DView'), { ssr: false });

export default function Home() {
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [onlineUsers, setOnlineUsers] = useState({});
  const [error, setError] = useState(null);
  const heartbeatRef = useRef();

  // Heartbeat pour signaler qu'on est en ligne
  // useEffect(() => {
  //   if (!me) return;
  //   function sendHeartbeat() {
  //     fetch(`/api/users/${me.id}`, {
  //       method: 'PATCH',
  //       body: JSON.stringify({ last_seen: Date.now() }),
  //       headers: { 'Content-Type': 'application/json' },
  //     });
  //   }
  //   sendHeartbeat();
  //   heartbeatRef.current = setInterval(sendHeartbeat, 10000); // toutes les 10s
  //   return () => clearInterval(heartbeatRef.current);
  // }, [me]);

  useEffect(() => {
    fetch('/api/users', { method: 'POST' })
      .then(res => {
        if (!res.ok) throw new Error('POST /api/users: ' + res.status);
        return res.json();
      })
      .then(user => {
        setMe(user);
        refresh();
      })
      .catch(e => setError(e.message));
  }, []);

  function refresh() {
    fetch('/api/users')
      .then(res => {
        if (!res.ok) throw new Error('GET /api/users: ' + res.status);
        return res.json();
      })
      .then(data => {
        setUsers(data);
        // Met à jour la liste des users en ligne
        const now = Date.now();
        const online = {};
        data.forEach(u => {
          if (u.last_seen && now - new Date(u.last_seen).getTime() < 20000) {
            online[u.id] = true;
          }
        });
        setOnlineUsers(online);
      })
      .catch(e => setError(e.message));
  }

  async function savePseudo(id) {
    if (!editValue.trim()) return;
    await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ pseudo: editValue }),
      headers: { 'Content-Type': 'application/json' },
    });
    setEditId(null);
    refresh();
  }

  const positions = getUserPositions(users);

  return (
    <main>
      {error && (
        <div style={{ color: 'red', fontFamily: 'Menlo', margin: 16 }}>Erreur API: {error}</div>
      )}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', position: 'relative' }}>
        <span className="title" style={{ fontSize: 20, textAlign: 'center' }}>what if everything was visible ?</span>
        <button className="menu" style={{ position: 'absolute', right: 32, fontSize: 18 }} onClick={refresh}>refresh ↻</button>
      </div>
      {/* Affichage 3D Force Graph (client only) */}
      <ForceGraph3DView users={users} me={me} onlineUsers={onlineUsers} />
      {/* Ancien affichage 2D en commentaire pour test */}
      {/*
      <div style={{ position: 'relative', width: '100vw', height: '70vh', minHeight: 400 }}>
        {users.map((user, i) => {
          const pos = positions[i] || { left: '0%', top: '0%' };
          const isOnline = user.id === me?.id || onlineUsers[user.id];
          return (
            <div
              key={user.id}
              style={{
                position: 'absolute',
                left: pos.left,
                top: pos.top,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                minWidth: 120,
              }}
            >
              <div
                style={{
                  marginRight: 8,
                  width: me?.id === user.id ? 28 : 16,
                  height: me?.id === user.id ? 28 : 16,
                  borderRadius: '50%',
                  background: isOnline ? '#000' : 'transparent',
                  transition: 'width 0.2s, height 0.2s, background 0.2s, border 0.2s',
                  border: isOnline ? (me?.id === user.id ? '2.5px solid #000' : '1.5px solid #aaa') : '3px solid #000',
                  boxSizing: 'border-box',
                }}
              />
              <div className="absolute" style={{ position: 'static', fontWeight: 'bold', fontSize: 18 }}>
                {editId === user.id ? (
                  <>
                    <span style={{ fontFamily: 'Menlo', fontWeight: 700, fontSize: 18, display: 'inline-block', verticalAlign: 'middle' }}>/user/</span>
                    <input
                      autoFocus
                      style={{
                        background: 'none',
                        border: 'none',
                        fontFamily: 'Menlo',
                        fontSize: 18,
                        color: '#000',
                        outline: 'none',
                        padding: 0,
                        margin: 0,
                        width: 90,
                        minWidth: 40,
                        maxWidth: 120,
                        textAlign: 'left',
                        fontWeight: 700,
                        caretColor: '#000',
                        height: 20,
                        lineHeight: '20px',
                        verticalAlign: 'middle',
                      }}
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={() => savePseudo(user.id)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          savePseudo(user.id);
                        }
                      }}
                    />
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        fontFamily: 'Menlo',
                        fontWeight: me?.id === user.id ? 700 : 400,
                        cursor: me?.id === user.id ? 'pointer' : 'default',
                        fontSize: 18,
                        display: 'inline-block',
                        verticalAlign: 'middle',
                      }}
                      onClick={() => {
                        if (me?.id === user.id) {
                          setEditId(user.id);
                          setEditValue(user.pseudo);
                        }
                      }}
                    >
                      /user/{user.pseudo}
                    </span>
                    {me?.id === user.id && (
                      <span
                        className="ml-1 cursor-pointer animate-blink"
                        style={{
                          display: 'inline-block',
                          verticalAlign: 'middle',
                          fontWeight: 700,
                          fontSize: 18,
                          borderLeft: '2px solid #000',
                          height: 20,
                        }}
                        onClick={() => {
                          setEditId(user.id);
                          setEditValue(user.pseudo);
                        }}
                      >
                        {'\u00A0'}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      */}
      {/* Liste des users en bas à gauche */}
      <div style={{
        position: 'fixed',
        left: 16,
        bottom: 16,
        background: 'rgba(255,255,255,0.95)',
        fontFamily: 'Menlo, monospace',
        fontSize: 16,
        color: '#000',
        padding: '12px 18px 12px 12px',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        zIndex: 1000,
        minWidth: 120,
        maxHeight: '40vh',
        overflowY: 'auto',
      }}>
        {users.map(user => (
          <div key={user.id} style={{ fontWeight: me?.id === user.id ? 700 : 400 }}>
            /user/{user.pseudo}
          </div>
        ))}
      </div>
    </main>
  );
}
