import { turso } from '../../../lib/turso';

// GET/POST pour les utilisateurs

export async function GET() {
  try {
    const result = await turso.execute('SELECT * FROM users ORDER BY id ASC');
    return Response.json(result.rows);
  } catch (e) {
    console.error('API GET /users error:', e);
    return new Response(JSON.stringify({ error: e.message || e.toString() }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Vérifie si un user existe déjà avec cette IP
    const existing = await turso.execute({
      sql: 'SELECT * FROM users WHERE ip = ?',
      args: [ip],
    });
    if (existing.rows.length > 0) {
      return Response.json(existing.rows[0]);
    }

    const userNum = Math.floor(1000 + Math.random() * 9000);
    const pseudo = `user${userNum}`;
    const result = await turso.execute({
      sql: 'INSERT INTO users (pseudo, ip) VALUES (?, ?) RETURNING *',
      args: [pseudo, ip],
    });
    return Response.json(result.rows[0]);
  } catch (e) {
    console.error('API POST /users error:', e);
    return new Response(JSON.stringify({ error: e.message || e.toString() }), { status: 500 });
  }
}
