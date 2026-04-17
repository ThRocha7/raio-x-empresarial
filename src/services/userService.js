import { api } from "@/config/apis";

export async function registerUser(data) {
  const { data: response } = await api.post("/register/user", data);
  return response.user;
}
