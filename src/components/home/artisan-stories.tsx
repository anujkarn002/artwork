import ArtisanStoryCard from "@/components/marketplace/artisan-story-card";

export default function ArtisanStories() {
  // In a real app, this would fetch from Supabase
  const artisanStories = [
    {
      id: 1,
      name: "Lakshmi Devi",
      title: "Master Weaver, Pochampally",
      story:
        "I learned this craft from my mother when I was 12. Today, after 40 years, I have trained over 50 women in my village to preserve our tradition.",
      imageUrl: "/images/IMG-20250327-WA0059.jpg",
    },
    {
      id: 2,
      name: "Ramesh Kumar",
      title: "Pottery Artist, Blue Pottery of Jaipur",
      story:
        "Each piece tells a story of our cultural heritage. The techniques we use have remained unchanged for centuries.",
      imageUrl: "/images/IMG-20250327-WA0063.jpg",
    },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Artisan Stories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {artisanStories.map((story) => (
            <ArtisanStoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}
