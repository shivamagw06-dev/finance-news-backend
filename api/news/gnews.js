export default async function handler(req, res) {
  const key = process.env.GNEWS_KEY; // set this in Vercel
  const q = req.query.q || "markets";
  const max = Number(req.query.pageSize || 12);
  if (!key) return res.status(500).json({ error: "Missing GNEWS_KEY" });

  // Use top-headlines (more relevant), country IN, lang EN
  const url = new URL("https://gnews.io/api/v4/top-headlines");
  url.searchParams.set("q", q);
  url.searchParams.set("lang", "en");
  url.searchParams.set("country", "in");
  url.searchParams.set("max", String(max));
  url.searchParams.set("token", key); // GNews uses 'token', not 'apikey'

  const r = await fetch(url);
  const data = await r.json();
  res.status(r.ok ? 200 : 500).json(data);
}
