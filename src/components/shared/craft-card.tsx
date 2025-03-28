import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface CraftCardProps {
  craft: {
    id: string;
    name: string;
    description: string;
    is_gi_tagged: boolean;
    image_url: string | null;
    regions: {
      id: string;
      name: string;
      state: string;
    } | null;
  };
}

export default function CraftCard({ craft }: CraftCardProps) {
  // Truncate description to a certain length
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <Link href={`/crafts/${craft.id}`}>
      <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
          {craft.image_url ? (
            <img
              src={craft.image_url}
              alt={craft.name}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-200 text-gray-500">
              No image available
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{craft.name}</h3>
            {craft.is_gi_tagged && (
              <Badge className="bg-green-100 text-green-800">GI Tagged</Badge>
            )}
          </div>
          <p className="mb-2 text-sm text-gray-600">
            {truncateDescription(craft.description)}
          </p>
        </CardContent>

        <CardFooter className="border-t bg-gray-50 p-3">
          <span className="text-sm text-gray-500">
            {craft.regions
              ? `${craft.regions.name}, ${craft.regions.state}`
              : "India"}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
