import Link from "next/link";

type CraftCardProps = {
  craft: {
    id: number;
    name: string;
    description: string;
    region: string;
    isGiTagged: boolean;
    imageUrl: string;
  };
};

export default function CraftCard({ craft }: CraftCardProps) {
  return (
    <div className="craft-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
      <div className="h-48 bg-gray-200 relative">
        {/* Replace with actual image when available */}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold text-gray-800">{craft.name}</h3>
          {craft.isGiTagged && (
            <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
              GI Tagged
            </span>
          )}
        </div>
        <p className="text-gray-600 mb-4">{craft.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{craft.region}</span>
          <Link
            href={`/crafts/${craft.id}`}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Explore →
          </Link>
        </div>
      </div>
    </div>
  );
}
