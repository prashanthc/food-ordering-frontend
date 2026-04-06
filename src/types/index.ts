export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  products: Product[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  couponCode?: string;
  status: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
