import axios from "axios";
import "dotenv/config";

// instância reutilizável com as configs base
const api = axios.create({ baseURL: "/api/v1" });

export async function registerUser(data) {
  try {
    const response = await api.post("/register", data);
    return response.data;
  } catch (err) {
    console.error("registerUser error:", err.response?.data ?? err.message);
    throw err;
  }
}

export async function notifyUser(data) {
  try {
    const response = await api.post("/notify", data);
    return response.data;
  } catch (err) {
    console.error("registerUser error:", err.response?.data ?? err.message);
    throw err;
  }
}
