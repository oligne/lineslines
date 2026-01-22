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
  const [popupHeights, setPopupHeights] = useState([]);
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

  // Fonction pour refetch l'utilisateur courant (me) depuis l'API
  async function refreshMe() {
    if (!me?.id) return;
    try {
      const res = await fetch(`/api/users/${me.id}`);
      if (!res.ok) throw new Error('GET /api/users/:id: ' + res.status);
      const user = await res.json();
      setMe(user);
      console.log('[Home] refreshMe: me updated', user);
    } catch (e) {
      console.error('[Home] refreshMe error', e);
    }
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

  // Ajoute un state local pour forcer l'affichage/cachage instantané du panneau
  const [showWelcomePanelLocal, setShowWelcomePanelLocal] = useState(true);

  // showWelcomePanel = vrai si starter=1 ET pas fermé localement
  const showWelcomePanel = (me && me.starter === 1) && showWelcomePanelLocal;

  // Affichage du panneau de bienvenue si starter n'est ni 0, ni '0', ni false, ni null
  // const showWelcomePanel = me && me.starter !== 0 && me.starter !== '0' && me.starter !== false && me.starter != null;

  const handlePopupHeight = (idx, height) => {
    setPopupHeights(prev => {
      const next = [...prev];
      next[idx] = height;
      return next;
    });
  };

  // Calcul dynamique des positions verticales des popups
  const [popupPositions, setPopupPositions] = useState([]);
  useEffect(() => {
    let top = showWelcomePanel ? 50 : 32;
    const positions = [];
    for (let i = 0; i < userPopups.length; i++) {
      positions[i] = top;
      top += (popupHeights[i] || 130) + 12;
    }
    setPopupPositions(positions);
  }, [userPopups, popupHeights, showWelcomePanel]);

  // Force un refresh des popups quand showWelcomePanel change (ex: fermeture manuelle)
  const [popupKeyRefresh, setPopupKeyRefresh] = useState(0);
  useEffect(() => {
    setPopupKeyRefresh(k => k + 1);
  }, [showWelcomePanel]);

  // LOG à chaque render du composant Home
  console.log('[Home RENDER]', { me, showWelcomePanel, userPopups, popupKeyRefresh });
  // LOG à chaque changement de me.starter
  useEffect(() => {
    console.log('[Home useEffect] me.starter', me?.starter);
  }, [me?.starter]);
  // LOG à chaque changement de showWelcomePanel
  useEffect(() => {
    console.log('[Home useEffect] showWelcomePanel', showWelcomePanel);
  }, [showWelcomePanel]);
  // LOG lors de la fermeture du welcome panel
  function handleCloseWelcome() {
    console.log('[Home] handleCloseWelcome called');
    setShowWelcomePanelLocal(false); // cache instantanément le panneau
    refreshMe(); // synchro BDD
  }

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
        }} onGraphUpdate={refresh} onCloseWelcome={handleCloseWelcome} />
      </div>
      {/* Colonne unique à droite : panneau de bienvenue en haut, profils/notifications en dessous */}
      <div style={{
        position: 'fixed',
        top: 32,
        zIndex: 3000,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        alignItems: 'flex-end',
        maxWidth: 340,
        minWidth: 220,
        pointerEvents: 'none'
      }}>
        {userPopups.length > 0 && userPopups.map((u, i) => {
          const isLinkedReverse = !!relations.find(r => String(r.user1_id) === String(u.id) && String(r.user2_id) === String(me?.id)) &&
            !relations.find(r => String(r.user1_id) === String(me?.id) && String(r.user2_id) === String(u.id));
          const topPx = popupPositions[i];
          const isReady = typeof topPx === 'number';
          return (
            <div key={u.id} style={{pointerEvents: 'auto', visibility: isReady ? 'visible' : 'hidden'}}>
              <UserPopup 
                key={u.id + '-' + relations.length + '-' + (showWelcomePanel ? 'open' : 'closed') + '-' + popupKeyRefresh}
                user={u}
                me={me}
                relations={relations}
                isLinkedReverse={isLinkedReverse}
                onClose={() => setUserPopups(prev => prev.filter(p => p.id !== u.id))}
                small
                showPseudo
                onCreateRelation={() => createRelation(me?.id, u.id)}
                onDeleteRelation={id => deleteRelation(me?.id, id)}
                welcomePanelVisible={showWelcomePanel}
                popupIndex={i}
                topPx={popupPositions[i] || (showWelcomePanel ? 50 : 32)}
                onHeight={handlePopupHeight}
                onGraphUpdate={refresh}
              />
            </div>
          );
        })}
      </div>
      
    </main>
  );
}


