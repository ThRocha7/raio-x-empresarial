import axios from "axios";

// instância reutilizável com as configs base
const api = axios.create({ baseURL: "/api/v1" });
