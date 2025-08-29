export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const key  = process.env.NEWSAPI_KEY;
  const q    = req.query.q || "markets";
  const page = Number(req.query.page || 1);
  const pageSize = Number(req.query.pageSize || 12);
  if (!key) return res.status(500).json({ error: "Missing NEWSAPI_KEY" });

  const url = new URL("https://newsapi.org/v2/top-headlines");
  url.searchParams.set("country", "in");
  url.searchParams.set("category", "business");
  url.searchParams.set("q", q);
  url.searchParams.set("page", String(page));
  url.searchParams.set("pageSize", String(pageSize));

  const r = await fetch(url, { headers: { "X-Api-Key": key } });
  const data = await r.json();
  res.status(r.ok ? 200 : 500).json(data);
}
