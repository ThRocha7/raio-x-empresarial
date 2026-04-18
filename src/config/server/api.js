import axios from "axios";
import { envs } from "@/config/server/envsConstants";

export const externalApi = axios.create({
  baseURL: envs.externalService.url,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${envs.externalService.token}`,
  },
});
