import { useState } from "react";
import { Minus, Plus, ShoppingBag, Tag, Trash2, X } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { orderApi } from "../services/api";
import { Order } from "../types";
import axios from "axios";

interface CartProps {
  onOrderSuccess: (order: Order) => void;
}

export default function Cart({ onOrderSuccess }: CartProps) {
  const {
    items,
    isOpen,
    couponCode,
    closeCart,
    removeItem,
    updateQuantity,
    setCouponCode,
    getTotal,
    clearCart,
  } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = getTotal();
  const discountPercent = 0.2;
  const discount = couponCode ? subtotal * discountPercent : 0;
  const finalAmount = subtotal - discount;

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const order = await orderApi.place({
        couponCode: couponCode || undefined,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      });
      clearCart();
      closeCart();
      onOrderSuccess(order);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Failed to place order");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="flex-1 bg-black/40 backdrop-blur-sm"
        onClick={closeCart}
      />

      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand-500" />
            <h2 className="font-bold text-lg text-gray-900">Your Cart</h2>
            {items.length > 0 && (
              <span className="bg-brand-100 text-brand-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-xl hover:bg-gray-100 transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <ShoppingBag size={48} className="text-gray-200 mb-3" />
              <p className="text-gray-400 font-medium">Your cart is empty</p>
              <p className="text-gray-300 text-sm mt-1">
                Add some delicious food!
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
              >
                <img
                  src={item.product.imageUrl || ""}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-lg object-cover bg-gray-200 flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                    {item.product.name}
                  </p>
                  <p className="text-brand-600 font-bold text-sm mt-0.5">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                    className="w-6 h-6 rounded-full bg-brand-100 hover:bg-brand-200 text-brand-700 flex items-center justify-center transition"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-500 flex items-center justify-center transition ml-1"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 space-y-4">
            <div className="relative">
              <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Promo code (optional)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent uppercase tracking-wider"
                maxLength={10}
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs font-medium bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {couponCode && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount (20%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-900 font-bold text-base pt-1.5 border-t border-gray-100">
                <span>Total</span>
                <span>${finalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white font-semibold py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Placing Order...
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  Place Order · ${finalAmount.toFixed(2)}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
