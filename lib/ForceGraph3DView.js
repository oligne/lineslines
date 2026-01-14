// lib/ForceGraph3DView.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Import dynamique de 3d-force-graph
let ForceGraph3DLib = null;

export default function ForceGraph3DView({ users, me, onlineUsers }) {
  const fgRef = useRef();

  useEffect(() => {
    console.log('ForceGraph3DView users:', users);
    let fg;
    let isMounted = true;
    if (!fgRef.current || !users.length) return;
    // Import dynamique du module et création du graphe
    import('3d-force-graph').then(mod => {
      if (!isMounted) return;
      ForceGraph3DLib = mod.default;
      const nodes = users.map((u, i) => ({
        id: u.id,
        name: u.pseudo, // propriété name ajoutée
        pseudo: u.pseudo,
        isMe: me?.id === u.id,
        isOnline: onlineUsers[u.id] || me?.id === u.id,
        x: i === 0 ? 0 : 100, // coordonnées fixes pour test
        y: 0,
        z: 0,
      }));
      console.log('ForceGraph3DView nodes:', nodes);
      fg = ForceGraph3DLib(fgRef.current)
        .graphData({ nodes, links: [] })
        .nodeThreeObject(node => new THREE.Mesh(
          new THREE.SphereGeometry(20),
          new THREE.MeshBasicMaterial({ color: '#ff00ff' })
        ));
    });
    // Clean up
    return () => {
      isMounted = false;
      if (fg && fg._destructor) fg._destructor();
    };
  }, [users, me, onlineUsers]);

  return <div ref={fgRef} style={{ width: '100vw', height: '70vh', minHeight: 400 }} />;
}
