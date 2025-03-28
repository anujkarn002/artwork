import Link from "next/link";

interface CraftPillProps {
  craft: {
    id: string;
    name: string;
  };
  isActive?: boolean;
}

export default function CraftPill({ craft, isActive = false }: CraftPillProps) {
  return (
    <Link
      href={`/crafts?category=${craft.id}`}
      className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        isActive
          ? "bg-indigo-100 text-indigo-800"
          : "hover:bg-gray-100 text-gray-700"
      }`}
    >
      {craft.name}
    </Link>
  );
}
