// import { createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";
import CraftCard from "@/components/marketplace/craft-card";

export default async function CraftsPage() {
  // In a production app, this would fetch from Supabase
  // Here using mock data for simplicity
  const crafts = [
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
    {
      id: 4,
      name: "Pochampally Ikat",
      description:
        "A unique tie-dye technique from Telangana that creates geometric patterns with intricate precision.",
      region: "Telangana, India",
      isGiTagged: true,
      imageUrl: "/placeholder.jpg",
    },
    {
      id: 5,
      name: "Banarasi Silk",
      description:
        "Luxurious silk sarees with ornate zari work from the holy city of Varanasi.",
      region: "Uttar Pradesh, India",
      isGiTagged: true,
      imageUrl: "/placeholder.jpg",
    },
    {
      id: 6,
      name: "Warli Art",
      description:
        "Tribal art form featuring distinctive geometric patterns and depictions of daily life.",
      region: "Maharashtra, India",
      isGiTagged: false,
      imageUrl: "/placeholder.jpg",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Explore Indian Crafts</h1>
      <p className="text-gray-600 mb-8">
        Discover the rich diversity of traditional crafts from across India
      </p>

      <div className="flex flex-wrap gap-4 mb-8">
        <button className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full">
          All Crafts
        </button>
        <button className="hover:bg-gray-100 px-4 py-2 rounded-full">
          Textiles
        </button>
        <button className="hover:bg-gray-100 px-4 py-2 rounded-full">
          Paintings
        </button>
        <button className="hover:bg-gray-100 px-4 py-2 rounded-full">
          Pottery
        </button>
        <button className="hover:bg-gray-100 px-4 py-2 rounded-full">
          Metal Work
        </button>
        <button className="hover:bg-gray-100 px-4 py-2 rounded-full">
          GI Tagged
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {crafts.map((craft) => (
          <CraftCard key={craft.id} craft={craft} />
        ))}
      </div>
    </div>
  );
}
