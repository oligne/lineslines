import { turso } from '../../../lib/turso';

// GET: retourne toutes les relations
export async function GET() {
  const result = await turso.execute('SELECT * FROM relations');
  return Response.json(result.rows);
}

// POST: crée une relation entre deux users
export async function POST(request) {
  const { user1_id, user2_id } = await request.json();
  if (!user1_id || !user2_id || user1_id === user2_id) {
    return new Response(JSON.stringify({ error: 'user1_id et user2_id requis et différents.' }), { status: 400 });
  }
  // Toujours stocker dans l'ordre croissant pour unicité
  const [a, b] = user1_id < user2_id ? [user1_id, user2_id] : [user2_id, user1_id];
  try {
    await turso.execute({
      sql: 'INSERT OR IGNORE INTO relations (user1_id, user2_id) VALUES (?, ?)',
      args: [a, b],
    });
    const result = await turso.execute({
      sql: 'SELECT * FROM relations WHERE user1_id = ? AND user2_id = ?',
      args: [a, b],
    });
    return Response.json(result.rows[0]);
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
