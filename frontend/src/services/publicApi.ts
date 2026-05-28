import axios from "axios";

export const publicApi = axios.create({
  baseURL: "http://localhost:3000/api",
});
