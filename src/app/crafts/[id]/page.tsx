import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    craftId: string;
  }>;
};

export default async function CraftDetailPage(props: Props) {
  // In a real app, this would fetch from Supabase based on params.craftId
  // Using mock data for this example
  const params = await props.params;
  const craftId = parseInt(params.craftId);

  // Mock craft data
  const craft = {
    id: craftId,
    name: "Pochampally Ikat",
    description:
      "A unique tie-dye technique from Telangana that creates geometric patterns with intricate precision.",
    region: "Telangana, India",
    isGiTagged: true,
    giTaggedYear: "2005",
    historicalContext:
      "Pochampally Ikat is a beautiful textile art with a unique style of tie-dye weaving where the warp and weft threads are tie-dyed before weaving, creating geometric patterns that appear to blur at the edges. This distinctive art form originates from Pochampally village in Telangana, India.",
    techniques: [
      "Design Creation on Graph Paper",
      "Yarn Preparation and Mapping",
      "Resist-Dyeing Process",
      "Traditional Handloom Weaving",
    ],
    characteristics: [
      "Geometric patterns with a characteristic blurred effect",
      "Double Ikat technique for complex designs",
      "Traditional color palette featuring rich contrasts",
      "Cotton, silk, or a blend of both materials",
      "Distinctive tie-dye process before weaving",
    ],
    materials: ["Cotton", "Silk", "Natural dyes"],
    artisans: [
      { id: 1, name: "Lakshmi Devi", experience: "40+ years" },
      { id: 2, name: "Ramesh Kumar", experience: "25+ years" },
    ],
    imageUrl: "/placeholder.jpg",
  };

  if (!craft) {
    notFound();
  }

  return (
    <div>
      {/* Craft Header with Basic Information */}
      <section className="bg-indigo-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Craft Image */}
            <div className="w-full md:w-2/5">
              <div className="aspect-w-4 aspect-h-3 bg-gray-300 rounded-lg h-[300px]">
                {/* Replace with actual image */}
              </div>
            </div>

            {/* Craft Information */}
            <div className="w-full md:w-3/5">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-indigo-800 px-3 py-1 rounded-full text-sm">
                  Textile
                </span>
                <span className="bg-indigo-800 px-3 py-1 rounded-full text-sm">
                  {craft.region}
                </span>
                {craft.isGiTagged && (
                  <span className="bg-green-700 px-3 py-1 rounded-full text-sm">
                    GI Tagged ({craft.giTaggedYear})
                  </span>
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
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-sm opacity-75">Active Artisans</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm opacity-75">Villages Involved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm opacity-75">Core Techniques</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="container mx-auto px-4 py-8">
        {/* Overview Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {craft.name}: An Overview
            </h2>

            <p className="mb-4 text-gray-600">{craft.historicalContext}</p>

            <h3 className="text-xl font-bold mt-6 mb-3 text-gray-800">
              Key Characteristics
            </h3>

            <ul className="list-disc pl-6 mb-6 text-gray-600">
              {craft.characteristics.map((characteristic, index) => (
                <li key={index}>{characteristic}</li>
              ))}
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-3 text-gray-800">
              Techniques Used
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {craft.techniques.map((technique, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg">
                  <p className="font-medium text-gray-800">
                    {index + 1}. {technique}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Location Map */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-4">
                Geographical Origin
              </h3>
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded mb-4 h-[150px]">
                {/* This would be an actual map in production */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Map of {craft.region}
                </div>
              </div>
              <p className="text-gray-600 text-sm">{craft.region}</p>
            </div>

            {/* Materials Used */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-4">Materials Used</h3>
              <div className="space-y-2">
                {craft.materials.map((material, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></div>
                    <span className="text-gray-600">{material}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Master Artisans */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-4">Master Artisans</h3>
              <div className="space-y-4">
                {craft.artisans.map((artisan) => (
                  <Link
                    key={artisan.id}
                    href={`/artisans/${artisan.id}`}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {artisan.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {artisan.experience}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-indigo-900 text-white rounded-lg shadow-md p-8 mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Support This Craft</h2>
            <p className="max-w-2xl mx-auto mb-8">
              By purchasing authentic {craft.name}, you help preserve this
              cultural heritage and support the artisan communities who keep
              this tradition alive.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/products?craft=${craftId}`}
                className="bg-white text-indigo-900 py-3 px-8 rounded-full font-medium hover:bg-gray-100 transition"
              >
                Shop Products
              </Link>
              <Link
                href={`/artisans?craft=${craftId}`}
                className="border border-white py-3 px-8 rounded-full font-medium hover:bg-white hover:text-indigo-900 transition"
              >
                Meet the Artisans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
