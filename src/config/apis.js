import axios from "axios";

// instância reutilizável com as configs base
export const api = axios.create({ baseURL: "/api/v1" });
