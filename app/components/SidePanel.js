import React from 'react';

export default function SidePanel({ onClose }) {
  // Le bouton de fermeture appelle simplement onClose transmis par le parent
  const handleClose = () => {
    if (onClose) onClose();
  };
  return (
    <div style={{
      position: 'fixed',
      top: 50,
      right: 20,
      zIndex: 3000,
      maxWidth: 340,
      minWidth: 260,
      marginTop: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      pointerEvents: 'auto',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.98)',
        borderRadius: 18,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        padding: '22px 20px 18px 20px',
        fontFamily: 'Menlo, monospace',
        fontSize: 16,
        color: '#111',
        lineHeight: 1.5,
        marginBottom: 0,
        position: 'relative',
        minWidth: 220,
        maxWidth: 340,
      }}>
        <button onClick={handleClose} style={{position:'absolute',top:8,right:10,fontSize:18,background:'none',border:'none',cursor:'pointer',color:'#888'}}>×</button>
        <b style={{fontSize:18}}>&gt; Bienvenue sur W.E.B.</b>
        <div style={{marginTop:8, marginBottom:10}}>
          Une experimentation numérique,<br/>
          qui au fil des connections,<br/>
          tisse sa toile.<br/>
          Chaque liens dessinent le territoire des usagers,<br/>
          et leurs relations. <br/>
          <br/>
          Nous allons ensemble, tenter de produire la carte de nos relations.
        </div>
        <div style={{marginTop:20}}>
          <span style={{display:'inline-block',marginRight:8,verticalAlign:'middle'}}>
            <span style={{display:'inline-block',width:16,height:16,borderRadius:8,background:'#111',marginRight:4}}></span>
          </span>
          Vous êtes un point.<br/>
          <br/>
          <span style={{display:'inline-block',marginRight:8,verticalAlign:'middle'}}>
            <span style={{display:'inline-block',width:18,height:10,borderRadius:6,border:'2px solid #111',marginRight:4,position:'relative',top:2}}></span>
          </span>
          Votre point peut indiquer qui sont ses points-copains et créer des liens entres vous.<br/>
          <br/>
          <span style={{display:'inline-block',marginRight:8,verticalAlign:'middle'}}>
            <span style={{display:'inline-block',width:18,height:10,borderRadius:6,border:'2px solid #111',marginRight:4,position:'relative',top:2}}></span>
          </span>
          Vous vous reconnaîtrez entre vous grâce à vos mots-clés.
        </div>
      </div>
    </div>
  );
}
