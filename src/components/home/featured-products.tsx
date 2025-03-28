import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/shared/product-card";

interface FeaturedProductsProps {
  products: Array<{
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
  }>;
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Handcrafted Treasures</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Authentic handcrafted products direct from artisans across India,
            each with a story to tell.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.length > 0
            ? products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            : // Placeholder cards if no products are available
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-lg h-96 animate-pulse"
                />
              ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild>
            <Link href="/products">Shop All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
