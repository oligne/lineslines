import { turso } from '../../../../lib/turso';

export async function PATCH(request, context) {
  const body = await request.json();
  const params = await context.params;
  const id = typeof params === 'object' && 'id' in params ? params.id : params;

  if (body.pseudo !== undefined) {
    await turso.execute({
      sql: 'UPDATE users SET pseudo = ? WHERE id = ?',
      args: [body.pseudo, id],
    });
  } else if (body.keywords !== undefined) {
    // On stocke les mots-clés comme une chaîne séparée par des virgules
    const keywordsStr = Array.isArray(body.keywords) ? body.keywords.join(',') : '';
    await turso.execute({
      sql: 'UPDATE users SET keywords = ? WHERE id = ?',
      args: [keywordsStr, id],
    });
  } else if (body.last_seen !== undefined) {
    await turso.execute({
      sql: 'UPDATE users SET last_seen = ? WHERE id = ?',
      args: [body.last_seen, id],
    });
  } else {
    return new Response(JSON.stringify({ error: 'Aucune donnée à mettre à jour.' }), { status: 400 });
  }

  const result = await turso.execute({
    sql: 'SELECT * FROM users WHERE id = ?',
    args: [id],
  });
  return Response.json(result.rows[0]);
}
