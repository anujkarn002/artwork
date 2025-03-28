// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Award } from "lucide-react";
import { Metadata } from "next";

interface CraftDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: CraftDetailPageProps): Promise<Metadata> {
  const supabase = await createServerSupabaseClient();

  const { data: craft } = await supabase
    .from("crafts")
    .select("name, description")
    .eq("id", params.id)
    .single();

  if (!craft) {
    return {
      title: "Craft Not Found | Artwork",
    };
  }

  return {
    title: `${craft.name} | Artwork`,
    description: craft.description.substring(0, 160),
  };
}

export default async function CraftDetailPage({
  params,
}: CraftDetailPageProps) {
  const supabase = await createServerSupabaseClient();

  // Fetch craft details
  const { data: craft, error } = await supabase
    .from("crafts")
    .select(
      `
      *,
      category:craft_categories(id, name),
      region:regions(id, name, state)
    `
    )
    .eq("id", params.id)
    .single();

  if (error || !craft) {
    notFound();
  }

  // Fetch artisans who work with this craft
  const { data: artisans } = await supabase
    .from("artisan_profiles")
    .select(
      `
      id,
      is_master_artisan,
      profiles:profiles(id, full_name, avatar_url, location)
    `
    )
    .eq("craft_id", params.id)
    .eq("verification_status", "verified")
    .limit(5);

  // Fetch products related to this craft
  const { data: products } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      price,
      discount_price,
      image_urls,
      artisan:artisan_profiles(
        id,
        profiles:profiles(id, full_name)
      )
    `
    )
    .eq("craft_id", params.id)
    .eq("is_available", true)
    .order("created_at", { ascending: false })
    .limit(4);

  // Parse materials and techniques from JSON
  let materials: string[] = [];
  let techniques: string[] = [];

  try {
    if (craft.materials) {
      materials =
        typeof craft.materials === "string"
          ? JSON.parse(craft.materials)
          : craft.materials;
    }

    if (craft.techniques) {
      techniques =
        typeof craft.techniques === "string"
          ? JSON.parse(craft.techniques)
          : craft.techniques;
    }
  } catch (e) {
    console.error("Error parsing JSON:", e);
  }

  return (
    <div>
      {/* Craft Header with Basic Information */}
      <section className="bg-indigo-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Craft Image */}
            <div className="w-full md:w-2/5">
              <div className="aspect-w-4 aspect-h-3 bg-indigo-800 rounded-lg h-[300px] overflow-hidden">
                {craft.image_url ? (
                  <img
                    src={craft.image_url}
                    alt={craft.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white/50">
                    No image available
                  </div>
                )}
              </div>
            </div>

            {/* Craft Information */}
            <div className="w-full md:w-3/5">
              <div className="flex flex-wrap gap-3 mb-4">
                {craft.category && (
                  <Badge className="bg-indigo-800 hover:bg-indigo-700">
                    {craft.category.name}
                  </Badge>
                )}

                {craft.region && (
                  <Badge className="bg-indigo-800 hover:bg-indigo-700">
                    {craft.region.name}, {craft.region.state}
                  </Badge>
                )}

                {craft.is_gi_tagged && (
                  <Badge className="bg-green-700 hover:bg-green-600">
                    GI Tagged {craft.gi_tag_year && `(${craft.gi_tag_year})`}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {craft.name}
              </h1>
              <p className="text-lg mb-6">{craft.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-indigo-800 pt-6">
                <div>
                  <p className="text-2xl font-bold">150+</p>
                  <p className="text-sm opacity-75">Years of History</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{artisans?.length || 0}+</p>
                  <p className="text-sm opacity-75">Verified Artisans</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{techniques.length || 0}</p>
                  <p className="text-sm opacity-75">Traditional Techniques</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{products?.length || 0}+</p>
                  <p className="text-sm opacity-75">Available Products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {craft.name}: An Overview
            </h2>

            <p className="mb-4 text-gray-600">{craft.historical_context}</p>

            <h3 className="text-xl font-bold mt-6 mb-3 text-gray-800">
              Key Characteristics
            </h3>

            <p className="mb-4 text-gray-600">{craft.cultural_significance}</p>

            {techniques.length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-6 mb-3 text-gray-800">
                  Techniques Used
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {techniques.map((technique, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-lg">
                      <p className="font-medium text-gray-800">
                        {index + 1}. {technique}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Location Map */}
            {craft.region && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-bold text-gray-800 mb-4">
                  Geographical Origin
                </h3>
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded mb-4 h-[150px]">
                  {/* This would be an actual map in production */}
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>
                      {craft.region.name}, {craft.region.state}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  {craft.region.state}, India
                </p>
              </div>
            )}

            {/* Materials Used */}
            {materials.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-bold text-gray-800 mb-4">Materials Used</h3>
                <div className="space-y-2">
                  {materials.map((material, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></div>
                      <span className="text-gray-600">{material}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Master Artisans */}
            {artisans && artisans.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-gray-800 mb-4">
                  Master Artisans
                </h3>
                <div className="space-y-4">
                  {artisans.map((artisan) => (
                    <Link
                      key={artisan.id}
                      href={`/artisans/${artisan.id}`}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 overflow-hidden">
                        {artisan.profiles?.avatar_url ? (
                          <img
                            src={artisan.profiles.avatar_url}
                            alt={artisan.profiles.full_name || "Artisan"}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {artisan.profiles?.full_name || "Artisan"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {artisan.is_master_artisan
                            ? "Master Artisan"
                            : "Artisan"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {products && products.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Available Products
              </h2>
              <Link
                href={`/products?craft=${craft.id}`}
                className="text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="aspect-w-1 aspect-h-1 w-full">
                      {product.image_urls && product.image_urls.length > 0 ? (
                        <img
                          src={product.image_urls[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        By {product.artisan?.profiles?.full_name || "Artisan"}
                      </p>
                      <p className="font-bold text-indigo-600">
                        ₹{(product.discount_price || product.price).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-indigo-900 text-white rounded-lg shadow-md p-8 mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Support This Craft</h2>
            <p className="max-w-2xl mx-auto mb-8">
              By purchasing authentic {craft.name} products, you help preserve
              this cultural heritage and support the artisan communities who
              keep this tradition alive.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                variant="default"
                className="bg-white text-indigo-900 hover:bg-gray-100"
              >
                <Link href={`/products?craft=${craft.id}`}>Shop Products</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-indigo-900"
              >
                <Link href={`/artisans?craft=${craft.id}`}>
                  Meet the Artisans
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
