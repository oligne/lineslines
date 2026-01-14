import React, { useRef, useEffect, useState } from 'react';

export default function ForceGraph3DTest() {
  const fgRef = useRef();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!fgRef.current) return;
    import('3d-force-graph').then(ForceGraph3D => {
      const nodes = [
        { id: 1, name: 'A', x: 0, y: 0, z: 0 },
        { id: 2, name: 'B', x: 50, y: 0, z: 0 }
      ];
      ForceGraph3D.default(fgRef.current)
        .graphData({ nodes, links: [] })
        .nodeLabel('name')
        .nodeColor('#ff0000')
        .nodeRelSize(16)
        .backgroundColor('#ffeedd')
        .cameraPosition({ x: 0, y: 0, z: 200 });
    });
  }, []);

  if (!isClient) return null;
  return <div ref={fgRef} style={{ width: '100vw', height: '70vh', minHeight: 400 }} />;
}
