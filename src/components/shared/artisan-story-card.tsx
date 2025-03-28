import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ArtisanStoryCardProps {
  artisan: {
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
  };
}

export default function ArtisanStoryCard({ artisan }: ArtisanStoryCardProps) {
  // Truncate story to a certain length
  const truncateStory = (text: string, maxLength: number = 200) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  // Get artisan's initials for avatar fallback
  const getInitials = () => {
    if (!artisan.profiles?.full_name) return "A";
    return artisan.profiles.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Link href={`/artisans/${artisan.id}`}>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div>
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={artisan.profiles?.avatar_url || ""}
                  alt={artisan.profiles?.full_name || "Artisan"}
                />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">
                {artisan.profiles?.full_name || "Artisan"}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {artisan.crafts?.name
                  ? `Master ${artisan.crafts.name} Artisan`
                  : "Master Artisan"}{" "}
                {artisan.profiles?.location && `• ${artisan.profiles.location}`}
              </p>

              <div className="mb-3 border-l-4 border-indigo-500 pl-3 italic text-gray-600">
                "{truncateStory(artisan.story)}"
              </div>

              <p className="text-indigo-600 text-sm font-medium hover:underline">
                Read full story →
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
