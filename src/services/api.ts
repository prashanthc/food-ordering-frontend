import axios from "axios";
import { AuthResponse, Order, OrderItem, Product } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

const http = axios.create({ baseURL: BASE_URL });

http.interceptors.request.use((config) => {
  const raw = localStorage.getItem("auth-storage");
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { state?: { token?: string } };
      const token = parsed?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore
    }
  }
  return config;
});

export const authApi = {
  register: (data: { email: string; name: string; password: string }) =>
    http.post<AuthResponse>("/auth/register", data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    http.post<AuthResponse>("/auth/login", data).then((r) => r.data),
};

export const productApi = {
  list: (params?: { category?: string; search?: string }) =>
    http.get<Product[]>("/api/product", { params }).then((r) => r.data),

  get: (productId: string) =>
    http.get<Product>(`/api/product/${productId}`).then((r) => r.data),
};

export const orderApi = {
  place: (data: { couponCode?: string; items: OrderItem[] }) =>
    http
      .post<Order>("/api/order", data, {
        headers: {
          "Idempotency-Key": crypto.randomUUID(),
        },
      })
      .then((r) => r.data),

  list: () => http.get<Order[]>("/api/orders").then((r) => r.data),
};
