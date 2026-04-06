import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, PackageOpen } from "lucide-react";
import { productApi } from "../services/api";
import { Order, Product } from "../types";
import Navbar from "../components/Navbar";
import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: { category?: string; search?: string } = {};
      if (category !== "All") params.category = category;
      if (debouncedSearch) params.search = debouncedSearch;
      const data = await productApi.list(params);
      setProducts(data);
    } catch {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [category, debouncedSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOrderSuccess = (order: Order) => {
    setSuccessOrder(order);
    setTimeout(() => setSuccessOrder(null), 6000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar search={search} onSearchChange={setSearch} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {successOrder && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl px-6 py-4 flex items-start gap-4 animate-in slide-in-from-top">
            <CheckCircle2 className="text-green-500 mt-0.5 flex-shrink-0" size={22} />
            <div>
              <p className="font-semibold text-green-800">Order placed successfully!</p>
              <p className="text-green-600 text-sm mt-0.5">
                Order #{successOrder.id.slice(0, 8).toUpperCase()} · Total: ${successOrder.finalAmount.toFixed(2)}
                {successOrder.discount > 0 && (
                  <span className="ml-2 text-green-500">
                    (saved ${successOrder.discount.toFixed(2)})
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <CategoryFilter selected={category} onChange={setCategory} />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {category === "All" ? "All Dishes" : category}
            </h1>
            {!loading && (
              <p className="text-gray-500 text-sm mt-0.5">
                {products.length} {products.length === 1 ? "item" : "items"} available
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <PackageOpen size={56} className="text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 text-brand-600 font-semibold hover:text-brand-700 text-sm"
            >
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <PackageOpen size={56} className="text-gray-200 mb-4" />
            <p className="text-gray-700 font-semibold text-lg">No dishes found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try a different category or search term
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Cart onOrderSuccess={handleOrderSuccess} />
    </div>
  );
}
