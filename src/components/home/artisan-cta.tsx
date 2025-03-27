import Link from "next/link";

export default function ArtisanCTA() {
  return (
    <section className="py-16 bg-indigo-900 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Are You an Artisan?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join our platform to showcase your craft, connect with global
          customers, and become part of our mission to preserve {"India's"}
          cultural heritage.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          <Link
            href="/join-as-artisan"
            className="bg-white text-indigo-900 py-3 px-8 rounded-full font-medium hover:bg-gray-100 transition"
          >
            Register as Artisan
          </Link>
          <Link
            href="/artisan-resources"
            className="border border-white py-3 px-8 rounded-full font-medium hover:bg-white hover:text-indigo-900 transition"
          >
            Learn More
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
          <div>
            <h3 className="text-3xl font-bold">100+</h3>
            <p>Art Forms</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">500+</h3>
            <p>Artisans</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">28</h3>
            <p>States</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">5000+</h3>
            <p>Products</p>
          </div>
        </div>
      </div>
    </section>
  );
}
