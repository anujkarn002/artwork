import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-indigo-900 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Preserving {"India's"} Artistic Heritage
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Connecting traditional artisans with the global market while
              documenting and preserving cultural treasures.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/crafts"
                className="bg-white text-indigo-900 py-2 px-6 rounded-full font-medium hover:bg-gray-100 transition"
              >
                Explore Crafts
              </Link>
              <Link
                href="/artisans"
                className="border border-white py-2 px-6 rounded-full font-medium hover:bg-white hover:text-indigo-900 transition"
              >
                Meet Artisans
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-w-16 aspect-h-9 relative h-[300px] md:h-[400px]">
              <Image
                src="/images/IMG-20250327-WA0062.jpg"
                alt="Artisan Craft"
                fill
                className="object-cover rounded-lg shadow-lg"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-5 -left-5 bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg">
              <p className="text-sm font-bold">
                Preserving 100+ Craft Traditions
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          fill="#ffffff"
        >
          <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
        </svg>
      </div>
    </section>
  );
}
