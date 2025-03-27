import Link from "next/link";

type ArtisanStoryCardProps = {
  story: {
    id: number;
    name: string;
    title: string;
    story: string;
    imageUrl: string;
  };
};

export default function ArtisanStoryCard({ story }: ArtisanStoryCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 h-[200px] bg-gray-200 relative">
          {/* Replace with actual image when available */}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{story.name}</h3>
          <p className="text-sm text-gray-500 mb-4">{story.title}</p>
          <p className="text-gray-600 mb-4">&quot;{story.story}&quot;</p>
          <Link
            href={`/artisans/${story.id}`}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Read Full Story →
          </Link>
        </div>
      </div>
    </div>
  );
}
