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
    const body = await request.json();
    const uuid = body.uuid || null;
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // 1. Cherche par UUID
    if (uuid) {
      const existingByUuid = await turso.execute({
        sql: 'SELECT * FROM users WHERE uuid = ?',
        args: [uuid],
      });
      if (existingByUuid.rows.length > 0) {
        return Response.json(existingByUuid.rows[0]);
      }
    }
    // 2. Sinon cherche par IP (pour compatibilité)
    const existingByIp = await turso.execute({
      sql: 'SELECT * FROM users WHERE ip = ?',
      args: [ip],
    });
    if (existingByIp.rows.length > 0) {
      return Response.json(existingByIp.rows[0]);
    }
    // 3. Sinon crée un nouvel utilisateur
    const userNum = Math.floor(1000 + Math.random() * 9000);
    const pseudo = `user${userNum}`;
    const result = await turso.execute({
      sql: 'INSERT INTO users (pseudo, ip, uuid) VALUES (?, ?, ?) RETURNING *',
      args: [pseudo, ip, uuid],
    });
    return Response.json(result.rows[0]);
  } catch (e) {
    console.error('API POST /users error:', e);
    return new Response(JSON.stringify({ error: e.message || e.toString() }), { status: 500 });
  }
}
