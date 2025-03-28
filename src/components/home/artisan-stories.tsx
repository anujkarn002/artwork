import Link from "next/link";
import { Button } from "@/components/ui/button";
import ArtisanStoryCard from "@/components/shared/artisan-story-card";

interface ArtisanStoriesProps {
  artisans: Array<{
    id: string;
    story: string;
    profiles: {
      id: string;
      full_name: string;
      avatar_url: string | null;
      location: string;
    } | null;
    crafts: {
      id: string;
      name: string;
    } | null;
  }>;
}

export default function ArtisanStories({ artisans }: ArtisanStoriesProps) {
  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Meet the Master Artisans</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Behind every craft is a story of passion, dedication, and cultural
            heritage. Meet the artisans preserving traditional crafts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {artisans.length > 0
            ? artisans.map((artisan) => (
                <ArtisanStoryCard key={artisan.id} artisan={artisan} />
              ))
            : // Placeholder cards if no artisans are available
              Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-lg h-64 animate-pulse"
                />
              ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild>
            <Link href="/artisans">Meet All Artisans</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
