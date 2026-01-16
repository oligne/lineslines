import { turso } from '../../../lib/turso';

// GET: retourne toutes les customisations de tous les users
export async function GET() {
  const result = await turso.execute('SELECT * FROM customizations');
  return Response.json(result.rows || []);
}
