import { turso } from '../../../../lib/turso';

export async function PATCH(request, context) {
  const body = await request.json();
  const params = await context.params;
  const id = typeof params === 'object' && 'id' in params ? params.id : params;

  let updated = false;
  if (body.pseudo !== undefined) {
    await turso.execute({
      sql: 'UPDATE users SET pseudo = ? WHERE id = ?',
      args: [body.pseudo, id],
    });
    updated = true;
  }
  if (body.keywords !== undefined) {
    const keywordsStr = Array.isArray(body.keywords) ? body.keywords.join(',') : '';
    await turso.execute({
      sql: 'UPDATE users SET keywords = ? WHERE id = ?',
      args: [keywordsStr, id],
    });
    updated = true;
  }
  if (body.last_seen !== undefined) {
    await turso.execute({
      sql: 'UPDATE users SET last_seen = ? WHERE id = ?',
      args: [body.last_seen, id],
    });
    updated = true;
  }
  if (body.starter !== undefined) {
    await turso.execute({
      sql: 'UPDATE users SET starter = ? WHERE id = ?',
      args: [body.starter, id],
    });
    updated = true;
  }
  if (!updated) {
    return new Response(JSON.stringify({ error: 'Aucune donnée à mettre à jour.' }), { status: 400 });
  }

  const result = await turso.execute({
    sql: 'SELECT * FROM users WHERE id = ?',
    args: [id],
  });
  return Response.json(result.rows[0]);
}

export async function GET(request, context) {
  try {
    const params = await context.params;
    const id = typeof params === 'object' && 'id' in params ? params.id : params;
    const result = await turso.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [id],
    });
    if (!result.rows[0]) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }
    return Response.json(result.rows[0]);
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || e.toString() }), { status: 500 });
  }
}
