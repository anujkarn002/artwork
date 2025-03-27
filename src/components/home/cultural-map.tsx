"use client";

import L from "leaflet";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
  iconUrl: "/leaflet/images/marker-icon.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
});
export default function CulturalMap() {
  const position = [22.9734, 78.6569]; // Center of India

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Discover {"India's"} Craft Heritage
            </h2>
            <p className="text-gray-600 mb-6">
              Explore the rich tapestry of traditional crafts across different
              regions of India. Our interactive cultural mapping helps preserve
              and showcase the geographical diversity of artisanal skills.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-full mr-4">
                  <svg
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
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
                  <svg
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
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
                  <svg
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
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

            <Link
              href="/cultural-map"
              className="inline-block bg-indigo-600 text-white py-3 px-8 rounded-full hover:bg-indigo-700 transition"
            >
              Explore the Map
            </Link>
          </div>

          <div className="relative">
            <div className="aspect-w-16 aspect-h-9 h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-md">
              <MapContainer
                center={position}
                zoom={5}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                  <Popup>{"India's"} Cultural Craft Center</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
