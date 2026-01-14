export async function GET(request) {
  // X-Forwarded-For est le plus fiable derrière Vercel/proxy
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || null;
  return new Response(JSON.stringify({ ip }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
