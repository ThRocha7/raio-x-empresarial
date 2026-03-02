import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const response = await axios.post(
      process.env.ENDPOINT_API,
      {
        ...req.body,
        process: "notifyUser",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${process.env.AUTH_API}`,
        },
      },
    );

    return res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Erro na API:", err.response?.data ?? err.message);
    return res.status(500).json({ error: "Erro ao registrar usuário" });
  }
}
