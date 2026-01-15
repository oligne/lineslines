import { turso } from '../../../lib/turso';

// GET: retourne la personnalisation d'un user (par user_id)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');
  if (!user_id) return new Response(JSON.stringify({ error: 'user_id requis' }), { status: 400 });
  const result = await turso.execute({
    sql: 'SELECT * FROM customizations WHERE user_id = ?',
    args: [user_id],
  });
  return Response.json(result.rows[0] || {});
}

// POST: crée une personnalisation (ou remplace)
export async function POST(request) {
  const body = await request.json();
  if (!body.user_id) return new Response(JSON.stringify({ error: 'user_id requis' }), { status: 400 });
  // On remplace tout (upsert)
  await turso.execute({
    sql: `INSERT OR REPLACE INTO customizations (user_id, eye, mouth, goodie, pos_x, pos_y, eye_x, eye_y, mouth_x, mouth_y, goodie_x, goodie_y)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
    args: [body.user_id, body.eye, body.mouth, body.goodie, body.pos_x, body.pos_y, body.eye_x, body.eye_y, body.mouth_x, body.mouth_y, body.goodie_x, body.goodie_y],
  });
  return Response.json({ success: true });
}

// PATCH: met à jour une personnalisation partiellement (UPSERT)
export async function PATCH(request) {
  const body = await request.json();
  console.log('PATCH body:', body); // log le body reçu
  if (!body.user_id) return new Response(JSON.stringify({ error: 'user_id requis' }), { status: 400 });
  // Champs par défaut (0 si non fourni)
  const defaults = {
    eye: 0, mouth: 0, goodie: 0, pos_x: 0, pos_y: 0, eye_x: 0, eye_y: 0, mouth_x: 0, mouth_y: 0, goodie_x: 0, goodie_y: 0, eye_scale: 1, mouth_scale: 1
  };
  const data = { ...defaults, ...body };
  console.log('PATCH data (merged):', data); // log les données fusionnées
  // UPSERT (insert or update)
  const result = await turso.execute({
    sql: `INSERT INTO customizations (user_id, eye, eye_x, eye_y, eye_scale, mouth, mouth_x, mouth_y, mouth_scale)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(user_id) DO UPDATE SET
            eye = excluded.eye,
            eye_x = excluded.eye_x,
            eye_y = excluded.eye_y,
            eye_scale = excluded.eye_scale,
            mouth = excluded.mouth,
            mouth_x = excluded.mouth_x,
            mouth_y = excluded.mouth_y,
            mouth_scale = excluded.mouth_scale` ,
    args: [data.user_id, data.eye, data.eye_x, data.eye_y, data.eye_scale, data.mouth, data.mouth_x, data.mouth_y, data.mouth_scale],
  });
  console.log('PATCH SQL result:', result); // log le résultat SQL
  return Response.json({ success: true });
}

// PATCH: met à jour une personnalisation partiellement (UPSERT) avec échelle
export async function PATCH_SCALE(request) {
  const body = await request.json();
  if (!body.user_id) return new Response(JSON.stringify({ error: 'user_id requis' }), { status: 400 });
  // Champs par défaut (0 si non fourni)
  const defaults = {
    eye: 0, mouth: 0, goodie: 0, pos_x: 0, pos_y: 0, eye_x: 0, eye_y: 0, mouth_x: 0, mouth_y: 0, goodie_x: 0, goodie_y: 0, eye_scale: 1, mouth_scale: 1
  };
  const data = { ...defaults, ...body };
  // UPSERT (insert or update)
  await turso.execute({
    sql: `INSERT INTO customizations (user_id, eye, eye_x, eye_y, eye_scale, mouth, mouth_x, mouth_y, mouth_scale)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(user_id) DO UPDATE SET
            eye = excluded.eye,
            eye_x = excluded.eye_x,
            eye_y = excluded.eye_y,
            eye_scale = excluded.eye_scale,
            mouth = excluded.mouth,
            mouth_x = excluded.mouth_x,
            mouth_y = excluded.mouth_y,
            mouth_scale = excluded.mouth_scale` ,
    args: [data.user_id, data.eye, data.eye_x, data.eye_y, data.eye_scale, data.mouth, data.mouth_x, data.mouth_y, data.mouth_scale],
  });
  return Response.json({ success: true });
}
