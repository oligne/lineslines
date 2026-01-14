import React from 'react';

export default function SidePanel({ users, me, onlineUsers }) {
  return (
    <div style={{
      position: 'fixed',
      top: 24,
      right: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      zIndex: 2000,
      maxWidth: 340,
      minWidth: 260
    }}>
      {/* Boîte de bienvenue/explications */}
      <div style={{
        background: 'rgba(255,255,255,0.98)',
        borderRadius: 18,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        padding: '22px 20px 18px 20px',
        fontFamily: 'Menlo, monospace',
        fontSize: 16,
        color: '#111',
        lineHeight: 1.5,
        marginBottom: 0
      }}>
        <b style={{fontSize:18}}>&gt; Bienvenue sur line's line.</b>
        <div style={{marginTop:8, marginBottom:10}}>
          Une experimentation numérique,<br/>
          qui au fil des connections,<br/>
          tisse sa toile.<br/>
          Chaque liens dessinent le territoire des usagers,<br/>
          et leurs relations.
        </div>
        <div style={{marginTop:8}}>
          <span style={{display:'inline-block',marginRight:8,verticalAlign:'middle'}}>
            <span style={{display:'inline-block',width:16,height:16,borderRadius:8,background:'#111',marginRight:4}}></span>
          </span>
          Vous êtes un point.<br/>
          <span style={{display:'inline-block',marginRight:8,verticalAlign:'middle'}}>
            <span style={{display:'inline-block',width:18,height:10,borderRadius:6,border:'2px solid #111',marginRight:4,position:'relative',top:2}}></span>
          </span>
          Votre point peut indiquer qui sont ses points-copains.<br/>
          <span style={{display:'inline-block',marginRight:8,verticalAlign:'middle'}}>
            <span style={{display:'inline-block',width:16,height:16,borderRadius:8,background:'#111',marginRight:4}}></span>
          </span>
          Vous vous reconnaîtrez entre vous grâce à vos mots-clés.
        </div>
      </div>
      {/* Liste des users (exemple, à adapter selon besoins) */}
      {users && users.length > 0 && users.map(user => {
        // Sécurise keywords : toujours un tableau
        let keywordsArr = [];
        if (Array.isArray(user.keywords)) {
          keywordsArr = user.keywords;
        } else if (typeof user.keywords === 'string' && user.keywords.length > 0) {
          keywordsArr = user.keywords.split(',').map(k => k.trim()).filter(Boolean);
        }
        return (
          <div key={user.id} style={{
            background: 'rgba(255,255,255,0.98)',
            borderRadius: 14,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            padding: '14px 16px 12px 16px',
            fontFamily: 'Menlo, monospace',
            fontSize: 15,
            color: '#111',
            marginBottom: 0,
            marginTop: 0
          }}>
            <b style={{fontSize:15}}>&gt; USER/{user.id}</b>
            <div style={{margin:'6px 0 8px 0'}}>
              {keywordsArr.length > 0 ? keywordsArr.join(', ') : <span style={{color:'#bbb'}}>Aucun mot-clé</span>}
            </div>
            {/* Actions à adapter selon logique (lier/délier, etc.) */}
          </div>
        );
      })}
    </div>
  );
}
