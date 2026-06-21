import axios from "axios";

export const userAPI = axios.create({
  baseURL: "/api",
});

export const codingAPI = axios.create({
  baseURL: "/api",
});

export const aiAPI = axios.create({
  baseURL: "/api",
});