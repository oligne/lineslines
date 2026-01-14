import React from 'react';

export default function SidePanel({ onClose }) {
  return (
    <div style={{
      maxWidth: 340,
      minWidth: 260
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
        position: 'relative'
      }}>
        <button onClick={onClose} style={{position:'absolute',top:8,right:10,fontSize:18,background:'none',border:'none',cursor:'pointer',color:'#888'}}>×</button>
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
    </div>
  );
}
