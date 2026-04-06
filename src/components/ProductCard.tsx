import { Plus } from "lucide-react";
import { Product } from "../types";
import { useCartStore } from "../store/cartStore";

const CATEGORY_COLORS: Record<string, string> = {
  Waffle: "bg-yellow-100 text-yellow-700",
  Burger: "bg-red-100 text-red-700",
  Pizza: "bg-orange-100 text-orange-700",
  Salad: "bg-green-100 text-green-700",
  Drink: "bg-blue-100 text-blue-700",
  Dessert: "bg-pink-100 text-pink-700",
  Wrap: "bg-purple-100 text-purple-700",
  Tacos: "bg-amber-100 text-amber-700",
};

const FALLBACK_IMAGES: Record<string, string> = {
  Waffle: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&h=300&fit=crop",
  Burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
  Pizza: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
  Salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
  Drink: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop",
  Dessert: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop",
  Wrap: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
  Tacos: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop",
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const categoryColor = CATEGORY_COLORS[product.category] ?? "bg-gray-100 text-gray-700";
  const imageUrl =
    product.imageUrl ||
    FALLBACK_IMAGES[product.category] ||
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop";

  const handleAdd = () => {
    addItem(product);
    openCart();
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-brand-200 flex flex-col">
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.currentTarget;
            target.src =
              FALLBACK_IMAGES[product.category] ||
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop";
          }}
        />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor}`}>
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 flex-1">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-3 py-1.5 rounded-xl transition-colors duration-200 active:scale-95"
          >
            <Plus size={15} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
