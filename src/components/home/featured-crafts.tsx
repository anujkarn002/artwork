import Link from "next/link";
import { Button } from "@/components/ui/button";
import CraftCard from "@/components/shared/craft-card";

interface FeaturedCraftsProps {
  crafts: Array<{
    id: string;
    name: string;
    description: string;
    is_gi_tagged: boolean;
    image_url: string;
    regions: {
      id: string;
      name: string;
      state: string;
    } | null;
  }>;
}

export default function FeaturedCrafts({ crafts }: FeaturedCraftsProps) {
  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">
            Explore Traditional Crafts
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the rich diversity of traditional crafts from across India,
            each with its unique cultural significance and artistic heritage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {crafts.length > 0
            ? crafts.map((craft) => <CraftCard key={craft.id} craft={craft} />)
            : // Placeholder cards if no crafts are available
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-lg h-64 animate-pulse"
                />
              ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild>
            <Link href="/crafts">View All Crafts</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
