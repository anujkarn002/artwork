import HeroSection from "@/components/home/hero-section";
import FeaturedCrafts from "@/components/home/featured-crafts";
import ArtisanStories from "@/components/home/artisan-stories";
import CulturalMap from "@/components/home/cultural-map";
import ArtisanCTA from "@/components/home/artisan-cta";

export default function Home() {
  return (
    <div className="space-y-16">
      <HeroSection />
      <FeaturedCrafts />
      <ArtisanStories />
      <CulturalMap />
      <ArtisanCTA />
    </div>
  );
}
