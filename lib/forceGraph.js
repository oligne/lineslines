// lib/forceGraph.js
// Utilitaire pour gérer le positionnement des points avec 3D Force Graph

// Pour l'instant, retourne des positions fixes (mock), à remplacer par la logique 3D ForceGraph
export function getUserPositions(users) {
  // TODO: intégrer 3D Force Graph ici
  // Retourne un tableau d'objets { left, top } pour chaque user
  const basePositions = [
    { left: '20%', top: '30%' },
    { left: '60%', top: '60%' },
    { left: '40%', top: '70%' },
    { left: '70%', top: '25%' },
    { left: '30%', top: '60%' },
    { left: '55%', top: '35%' },
    { left: '75%', top: '55%' },
    { left: '15%', top: '65%' },
  ];
  return users.map((u, i) => basePositions[i % basePositions.length]);
}
