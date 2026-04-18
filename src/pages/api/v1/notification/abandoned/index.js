import { externalApi } from "@/config/server/api";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!req.body) return res.status(400).json({ error: "Invalid body." });

  try {
    const response = await externalApi.post("/", {
      ...req.body,
      process: "notifyAbandoned",
    });

    return res.status(response.status).json(response.data);
  } catch (err) {
    console.error("API error:", err.response?.data ?? err.message);
    return res.status(err.response?.status || 500).json({ error: "..." });
  }
}
