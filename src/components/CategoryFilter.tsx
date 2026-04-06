const CATEGORIES = [
  "All",
  "Waffle",
  "Burger",
  "Pizza",
  "Salad",
  "Drink",
  "Dessert",
  "Wrap",
  "Tacos",
];

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({
  selected,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selected === cat
              ? "bg-brand-500 text-white shadow-md shadow-brand-200"
              : "bg-white text-gray-600 border border-gray-200 hover:border-brand-300 hover:text-brand-600"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
