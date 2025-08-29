export default async function handler(req, res) {
  const key = process.env.MEDIASTACK_KEY;
  const q = req.query.q || "markets";
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.pageSize || 12);
  if (!key) return res.status(500).json({ error: "Missing MEDIASTACK_KEY" });

  const url = new URL("http://api.mediastack.com/v1/news");
  url.searchParams.set("access_key", key);
  url.searchParams.set("countries", "in");
  url.searchParams.set("languages", "en");
  url.searchParams.set("categories", "business");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String((page-1)*limit));
  url.searchParams.set("keywords", q);

  const r = await fetch(url);
  const data = await r.json();
  res.status(r.ok ? 200 : 500).json(data);
}
