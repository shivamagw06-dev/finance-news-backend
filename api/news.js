// api/news.js
import fetch from "node-fetch";

let current = 0;
const sources = [
  {
    name: "mediastack",
    url: `http://api.mediastack.com/v1/news?access_key=${process.env.MEDIASTACK_KEY}&categories=business,finance&limit=10`
  },
  {
    name: "newsapi",
    url: `https://newsapi.org/v2/top-headlines?category=business&apiKey=${process.env.NEWSAPI_KEY}&pageSize=10`
  },
  {
    name: "gnews",
    url: `https://gnews.io/api/v4/top-headlines?topic=business&token=${process.env.GNEWS_KEY}&max=10`
  }
];

export default async function handler(req, res) {
  let data = [];
  let tried = 0;

  while (tried < sources.length && data.length === 0) {
    const source = sources[current];
    try {
      const r = await fetch(source.url);
      const json = await r.json();
      data = json.articles || json.data || [];
    } catch (e) {
      console.error("Error fetching", source.name, e);
    }
    current = (current + 1) % sources.length;
    tried++;
  }

  const payload = data.slice(0, 10).map(item => ({
    title: item.title,
    description: item.description,
    url: item.url,
    image: item.image || item.urlToImage || "",
    source: item.source?.name || ""
  }));

  res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate");
  res.status(200).json(payload);
}
