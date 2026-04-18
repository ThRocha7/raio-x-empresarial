import { api } from "@/config/client/api";

export async function registerUser(data) {
  const { data: response } = await api.post("/register/user", data);
  return response.user;
}
