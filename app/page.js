// Page principale
'use client';
import React, { useEffect, useState, useRef } from 'react';
import { getUserPositions } from '../lib/forceGraph';
import FocusGraph from './components/FocusGraphWrapper';
import SidePanel from './components/SidePanel';
import UserPopup from './components/UserPopup';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [relations, setRelations] = useState([]); // relations entre users
  const [me, setMe] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [onlineUsers, setOnlineUsers] = useState({});
  const [error, setError] = useState(null);
  const [userPopups, setUserPopups] = useState([]); // tableau d'utilisateurs sélectionnés
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeClosedManually, setWelcomeClosedManually] = useState(false);
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
    // Gestion UUID utilisateur (cookie)
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
    function setCookie(name, value, days) {
      let expires = '';
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    let uuid = getCookie('user_uuid');
    if (!uuid) {
      uuid = uuidv4();
      setCookie('user_uuid', uuid, 365);
    }
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uuid })
    })
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

  useEffect(() => {
    // Ferme la bienvenue si on ouvre un user, la rouvre si aucun user
    if (userPopups.length > 0) setShowWelcome(false);
    else if (!welcomeClosedManually) setShowWelcome(true);
  }, [userPopups, welcomeClosedManually]);

  useEffect(() => {
    fetch('/api/relations')
      .then(res => res.json())
      .then(setRelations)
      .catch(() => setRelations([]));
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

  // Fonction pour créer un lien entre deux users
  async function createRelation(user1_id, user2_id) {
    if (!user1_id || !user2_id || user1_id === user2_id) return;
    await fetch('/api/relations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user1_id, user2_id })
    });
    // Refresh relations après création
    fetch('/api/relations')
      .then(res => res.json())
      .then(setRelations);
  }

  // Fonction pour délier (supprimer la relation dans le sens me->u)
  async function deleteRelation(user1_id, user2_id) {
    if (!user1_id || !user2_id || user1_id === user2_id) return;
    console.log('API PATCH /api/relations', { user1_id, user2_id, action: 'delete' });
    await fetch('/api/relations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user1_id, user2_id, action: 'delete' })
    });
    // Refresh relations après suppression
    fetch('/api/relations')
      .then(res => res.json())
      .then(setRelations);
  }

  const positions = getUserPositions(users);

  // Construction du graph pour FocusGraph
  const nodes = users.map(u => ({
    id: u.id,
    group: 1,
    label: u.pseudo,
    keywords: typeof u.keywords === 'string' && u.keywords.length > 0 ? u.keywords.split(',').map(k => k.trim()).filter(Boolean) : [],
    ip: u.ip || null
  }));
  // Construction des liens à partir des relations, uniquement si les deux users existent
  const userIds = new Set(users.map(u => u.id));
  const links = relations
    .filter(r => userIds.has(r.user1_id) && userIds.has(r.user2_id))
    .map(r => ({
      source: r.user1_id,
      target: r.user2_id
    }));
  const graphData = JSON.stringify({ nodes, links });

  // Affichage du panneau de bienvenue si starter n'est ni 0, ni '0', ni false, ni null
  const showWelcomePanel = me && me.starter !== 0 && me.starter !== '0' && me.starter !== false && me.starter != null;

  return (
    <main>
      {error && (
        <div style={{ color: 'red', fontFamily: 'Menlo', margin: 16 }}>Erreur API: {error}</div>
      )}
      {/* Titre + refresh tout en haut */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 0, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 4000, background: 'rgba(255,255,255,0.97)', padding: '10px 0 2px 0', borderBottom: '1px solid #eee' }}>
        <span className="title" style={{ fontSize: 20, textAlign: 'center' }}>what if everything was visible ?</span>
        <button className="menu" style={{ position: 'absolute', top: 8, right: 24, fontSize: 15 }} onClick={refresh}>refresh ↻</button>
      </div>
      {/* Affichage 3D Force Graph (client only) */}
      <div style={{ width: '100vw', height: '70vh', minHeight: 400, marginTop: 54 }}>
        <FocusGraph data={graphData} userIp={me?.ip} onUserNodeClick={u => {
          if (u.id !== me?.id) setUserPopups(prev => prev.some(p => p.id === u.id) ? prev : [...prev, u]);
        }} onGraphUpdate={refresh} />
      </div>
      {/* Colonne unique à droite : panneau de bienvenue en haut, profils/notifications en dessous */}
      <div style={{
        position: 'fixed',
        top: 32,
        right: 32,
        zIndex: 3000,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        alignItems: 'flex-end',
        maxWidth: 340,
        minWidth: 220,
        pointerEvents: 'none'
      }}>
        {showWelcomePanel && (
          <div style={{pointerEvents: 'auto'}}>
            <SidePanel onClose={async () => {
              setShowWelcome(false);
              setWelcomeClosedManually(true);
              if (me?.id) {
                await fetch(`/api/users/${me.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ starter: 0 })
                });
              }
            }} />
          </div>
        )}
        {userPopups.length > 0 && userPopups.map((u) => (
          <div key={u.id} style={{pointerEvents: 'auto'}}>
            <UserPopup user={u} me={me} onClose={() => setUserPopups(prev => prev.filter(p => p.id !== u.id))} small showPseudo
              onCreateRelation={() => createRelation(me?.id, u.id)}
              onDeleteRelation={id => deleteRelation(me?.id, id)}
              isLinked={!!relations.find(r => (r.user1_id === me?.id && r.user2_id === u.id) || (r.user2_id === me?.id && r.user1_id === u.id))}
            />
          </div>
        ))}
      </div>
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
      {/* <div style={{
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
      </div> */}
    </main>
  );
}
