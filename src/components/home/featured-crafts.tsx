import Link from "next/link";
import CraftCard from "@/components/marketplace/craft-card";

export default async function FeaturedCrafts() {
  // In a real app, this would fetch from Supabase
  const featuredCrafts = [
    {
      id: 1,
      name: "Madhubani Painting",
      description:
        "Traditional folk art from Bihar with rich cultural symbolism and vibrant colors.",
      region: "Bihar, India",
      isGiTagged: true,
      imageUrl: "/placeholder.jpg",
    },
    {
      id: 2,
      name: "Pashmina Shawls",
      description:
        "Exquisite handwoven shawls from Kashmir made from fine wool of Changthangi goats.",
      region: "Kashmir, India",
      isGiTagged: true,
      imageUrl: "/placeholder.jpg",
    },
    {
      id: 3,
      name: "Bidriware",
      description:
        "Metal handicraft from Bidar with silver inlay work on blackened alloy of zinc and copper.",
      region: "Karnataka, India",
      isGiTagged: true,
      imageUrl: "/placeholder.jpg",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Featured Crafts
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCrafts.map((craft) => (
            <CraftCard key={craft.id} craft={craft} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/crafts"
            className="inline-block bg-indigo-600 text-white py-3 px-8 rounded-full hover:bg-indigo-700 transition"
          >
            View All Crafts
          </Link>
        </div>
      </div>
    </section>
  );
}
