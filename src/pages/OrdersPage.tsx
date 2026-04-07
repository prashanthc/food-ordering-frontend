import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  PackageOpen,
  Tag,
  Calendar,
  Receipt,
} from "lucide-react";
import { orderApi } from "../services/api";
import { Order } from "../types";

const categoryImages: Record<string, string> = {
  Waffle:
    "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=80&h=80&fit=crop",
  Burger:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop",
  Pizza:
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&h=80&fit=crop",
  Salad:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&h=80&fit=crop",
  Drink:
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=80&h=80&fit=crop",
  Dessert:
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=80&h=80&fit=crop",
  Wrap: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=80&h=80&fit=crop",
  Tacos:
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=80&h=80&fit=crop",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    orderApi
      .list()
      .then(setOrders)
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Link
              to="/"
              className="p-2 -ml-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <Receipt size={20} className="text-brand-500" />
              <h1 className="text-lg font-bold text-gray-900">My Orders</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <PackageOpen size={56} className="text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Package size={56} className="text-gray-200 mb-4" />
            <p className="text-gray-700 font-semibold text-lg">
              No orders yet
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Browse dishes and place your first order
            </p>
            <Link
              to="/"
              className="mt-4 text-brand-600 font-semibold hover:text-brand-700 text-sm"
            >
              Browse dishes
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center">
                      <Package size={18} className="text-brand-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Calendar size={12} />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                    {order.status}
                  </span>
                </div>

                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {order.products?.map((product, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img
                          src={
                            product.imageUrl ||
                            categoryImages[product.category] ||
                            categoryImages["Burger"]
                          }
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {product.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            x{order.items?.[idx]?.quantity || 1}
                          </p>
                          <p className="text-xs text-gray-400">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500">
                        Subtotal:{" "}
                        <span className="text-gray-700">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </span>
                      {order.discount > 0 && (
                        <span className="flex items-center gap-1 text-green-600">
                          <Tag size={14} />
                          -${order.discount.toFixed(2)}
                          {order.couponCode && (
                            <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                              {order.couponCode}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    <span className="text-base font-bold text-gray-900">
                      ${order.finalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
