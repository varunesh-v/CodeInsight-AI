import axios from "axios";

export const userAPI = axios.create({
  baseURL: "http://localhost:5000",
});

export const codingAPI = axios.create({
  baseURL: "http://localhost:5001",
});

export const aiAPI = axios.create({
  baseURL: "http://localhost:5002",
});