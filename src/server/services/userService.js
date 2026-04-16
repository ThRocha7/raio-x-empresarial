import { insertUser } from "../repositories/userRepository";

export async function registerUser(data) {
  const values = [
    data.name,
    data.phoneNumber,
    data.company,
    data.role,
    data.email,
  ];

  const user = await insertUser(values);
  return user;
}
