"use client";

const categories = [
  { name: 'Spesa',  },
  { name: 'Sushi • Giapponese',  },
  { name: 'Poke',  },
  { name: 'Kebab',  },
  // …altre categorie
];

export default function CategoryNav() {
  return (
    <nav className="flex space-x-4 overflow-x-auto py-4">
      {categories.map(({ name, icon: img }) => (
        <button
          key={name}
          className="flex flex-col items-center w-24 shrink-0 hover:text-orange-500 focus:outline-none"
        >
          <span className="bg-gray-100 p-3 rounded-full mb-1">
            <img className="h-6 w-6" />
          </span>
          <span className="text-xs text-center">{name}</span>
        </button>
      ))}
    </nav>
  );
}
