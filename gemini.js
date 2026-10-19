// Прокси к Gemini API. Запускается на сервере Vercel во Франкфурте (см. vercel.json),
// поэтому Google видит Германию, а не страну бота. Ключ не хранится: его передаёт бот.
const TARGET = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

export async function POST(request) {
  const auth = request.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) {
    return new Response('{"error":"no api key"}', { status: 401, headers: { "Content-Type": "application/json" } });
  }
  try {
    const upstream = await fetch(TARGET, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: await request.text(),
    });
    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 502, headers: { "Content-Type": "application/json" } });
  }
}

export function GET() {
  return new Response("Gemini proxy is running", { status: 200 });
}
