// api/news.js

import fetch from "node-fetch";  // add this import!

export default async function handler(req, res) {
  try {
    const apiKey = process.env.GNEWS_API_KEY;

    if (!apiKey) {
      throw new Error("GNEWS_API_KEY is missing. Set it in Vercel → Environment Variables.");
    }

    const query = req.query.q || "finance";

    const response = await fetch(
      `https://gnews.io/api/v4/search?q=${query}&lang=en&country=in&max=10&apikey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`GNews API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
