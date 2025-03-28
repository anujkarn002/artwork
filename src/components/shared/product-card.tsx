import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    discount_price: number | null;
    image_urls: string[];
    crafts: {
      id: string;
      name: string;
    } | null;
    artisan: {
      id: string;
      profiles: {
        id: string;
        full_name: string;
        location: string;
      } | null;
    } | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  // Calculate discount percentage if discount price exists
  const calculateDiscount = () => {
    if (!product.discount_price) return null;
    const discount =
      ((product.price - product.discount_price) / product.price) * 100;
    return Math.round(discount);
  };

  const discountPercentage = calculateDiscount();

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="relative">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
            {product.image_urls && product.image_urls.length > 0 ? (
              <img
                src={product.image_urls[0]}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-200 text-gray-500">
                No image available
              </div>
            )}
          </div>

          {discountPercentage && (
            <Badge className="absolute left-3 top-3 bg-red-500 text-white">
              {discountPercentage}% OFF
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="mb-1">
            <p className="text-sm text-gray-500">
              {product.crafts?.name || "Traditional Craft"}
            </p>
          </div>

          <h3 className="mb-2 text-lg font-medium">{product.name}</h3>

          <div className="flex items-center">
            {product.discount_price ? (
              <>
                <span className="mr-2 font-semibold">
                  ₹{product.discount_price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-semibold">₹{product.price.toFixed(2)}</span>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t bg-gray-50 p-3">
          <span className="text-sm text-gray-600">
            {product.artisan?.profiles?.full_name
              ? `By ${product.artisan.profiles.full_name}`
              : "Artwork Artisan"}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
