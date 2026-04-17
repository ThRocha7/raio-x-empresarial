import { api } from "@/config/apis";

export async function notifyUser(data) {
  try {
    const response = await api.post("notification/notify", data);
    return response.data;
  } catch (err) {
    console.error("registerUser error:", err.response?.data ?? err.message);
    throw err;
  }
}
