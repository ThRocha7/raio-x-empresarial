import { registerUser } from "@/server/services/userService";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { name, whatsapp, email, company, role, lgpdConsent } = req.body;

    if (!name || !whatsapp || !email || !company || !role || !lgpdConsent)
      return res.status(400).json({ error: "Required data is missing." });

    const digits = whatsapp.replace(/\D/g, "");
    const phoneNumber = `55${digits}`;

    const data = { name, phoneNumber, email, company, role, lgpdConsent };
    const user = await registerUser(data);

    return res.status(201).json({ message: "sucess", user });
  } catch (err) {
    console.error("Erro na API:", err);
    return res.status(500).json({ error: "Failed to register user" });
  }
}
