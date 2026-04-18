import axios from "axios";

// Internal API base
export const api = axios.create({ baseURL: "/api/v1" });
