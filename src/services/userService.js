import { api } from "@/config/apis";

export async function registerUser(data) {
  const { data: response } = await api.post("/register/user", data);
  return response.user;
}

// export async function notifyUser(data) {
//   try {
//     const response = await api.post("/notify", data);
//     return response.data;
//   } catch (err) {
//     console.error("registerUser error:", err.response?.data ?? err.message);
//     throw err;
//   }
// }
