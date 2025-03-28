"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { MapPin, Book, Users } from "lucide-react";

// Dynamically import the Map component with SSR disabled
const Map = dynamic(() => import("./map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-200">
      Loading map...
    </div>
  ),
});

export default function CulturalMap() {
  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Discover India's Craft Heritage
            </h2>
            <p className="text-gray-600 mb-6">
              Explore the rich tapestry of traditional crafts across different
              regions of India. Our interactive cultural mapping helps preserve
              and showcase the geographical diversity of artisanal skills.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-full mr-4">
                  <MapPin className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">
                    Regional Diversity
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Discover craft traditions unique to each state and region
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-full mr-4">
                  <Book className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">
                    Historical Context
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Learn about the origins and evolution of each craft
                    tradition
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-full mr-4">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">
                    Artisan Communities
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Connect with artisan clusters preserving traditional crafts
                  </p>
                </div>
              </div>
            </div>

            <Button asChild>
              <Link href="/cultural-map">Explore the Map</Link>
            </Button>
          </div>

          <div className="relative">
            <div className="aspect-w-16 aspect-h-9 h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-md">
              <Map />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
