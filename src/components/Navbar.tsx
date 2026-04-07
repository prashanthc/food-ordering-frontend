import { LogOut, Receipt, ShoppingCart, UtensilsCrossed, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";

interface NavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function Navbar({ search, onSearchChange }: NavbarProps) {
  const { user, logout } = useAuthStore();
  const { getItemCount, openCart } = useCartStore();
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <UtensilsCrossed size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FoodKart</span>
          </div>

          <div className="flex-1 max-w-lg">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search for dishes..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/orders"
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
              title="My Orders"
            >
              <Receipt size={22} />
            </Link>

            <button
              onClick={openCart}
              className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
            >
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-brand-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1">
                  {itemCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                <User size={16} className="text-brand-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.name}
              </span>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
