import { createServerSupabaseClient } from "@/lib/supabase/server";
import HeroSection from "@/components/home/hero-section";
import FeaturedCrafts from "@/components/home/featured-crafts";
import FeaturedProducts from "@/components/home/featured-products";
import ArtisanStories from "@/components/home/artisan-stories";
import CulturalMap from "@/components/home/cultural-map";
import ArtisanCTA from "@/components/home/artisan-cta";
import { Craft, Product, ArtisanProfile } from "@/types/database";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();

  // Fetch featured crafts
  const { data: featuredCrafts } = await supabase
    .from("crafts")
    .select(
      `
      id,
      name,
      description,
      region_id,
      is_gi_tagged,
      image_url,
      regions:regions(id, name, state),
    `
    )
    .eq("featured", true)
    .limit(4);

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      description,
      price,
      discount_price,
      image_urls,
      crafts:crafts(id, name),
      artisan:artisan_profiles(
        id,
        profiles:profiles(id, full_name, location)
      )
    `
    )
    .eq("is_featured", true)
    .eq("is_available", true)
    .order("created_at", { ascending: false })
    .limit(8);

  // Fetch artisan stories
  const { data: artisanStories } = await supabase
    .from("artisan_profiles")
    .select(
      `
      id,
      story,
      profiles:profiles(id, full_name, avatar_url, location),
      crafts:crafts(id, name)
    `
    )
    .eq("is_master_artisan", true)
    .eq("verification_status", "verified")
    .limit(2);

  console.log("featuredCrafts", featuredCrafts);
  console.log("featuredProducts", featuredProducts);
  console.log("artisanStories", artisanStories);
  return (
    <div className="space-y-16">
      <HeroSection />

      <FeaturedCrafts crafts={(featuredCrafts as any[]) || []} />

      <FeaturedProducts products={(featuredProducts as any[]) || []} />

      <ArtisanStories artisans={(artisanStories as any[]) || []} />

      <CulturalMap />

      <ArtisanCTA />
    </div>
  );
}
