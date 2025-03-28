import { createServerSupabaseClient } from "@/lib/supabase/server";
import CraftCard from "@/components/shared/craft-card";
import CraftsFilters from "@/components/crafts/filters";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Crafts | Artwork",
  description:
    "Discover traditional Indian crafts and their cultural significance",
};

interface CraftsPageProps {
  searchParams: Promise<{
    category?: string;
    region?: string;
    gi_tagged?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function CraftsPage(props: CraftsPageProps) {
  const searchParams = await props.searchParams;
  const supabase = await createServerSupabaseClient();

  // Get query parameters
  const categoryId = searchParams.category;
  const regionId = searchParams.region;
  const isGiTagged = searchParams.gi_tagged === "true";
  const searchQuery = searchParams.search || "";
  const currentPage = parseInt(searchParams.page || "1");
  const pageSize = 12; // Items per page

  // Fetch craft categories for filter
  const { data: categories } = await supabase
    .from("craft_categories")
    .select("id, name")
    .order("name");

  // Fetch regions for filter
  const { data: regions } = await supabase
    .from("regions")
    .select("id, name, state")
    .order("name");

  // Build crafts query
  let craftsQuery = supabase.from("crafts").select(`
      id,
      name,
      description,
      region_id,
      is_gi_tagged,
      image_url,
      regions:regions(id, name, state)
    `);

  // Apply filters
  if (categoryId) {
    craftsQuery = craftsQuery.eq("category_id", categoryId);
  }

  if (regionId) {
    craftsQuery = craftsQuery.eq("region_id", regionId);
  }

  if (isGiTagged) {
    craftsQuery = craftsQuery.eq("is_gi_tagged", true);
  }

  if (searchQuery) {
    craftsQuery = craftsQuery.or(
      `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
    );
  }

  // Apply pagination
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  // Execute query with range
  const { data: crafts, count } = await craftsQuery
    .order("name")
    .range(from, to);

  // Calculate total pages
  const totalCrafts = count || 0;
  const totalPages = Math.ceil(totalCrafts / pageSize);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Explore Indian Crafts</h1>
      <p className="text-gray-600 mb-8">
        Discover the rich diversity of traditional crafts from across India
      </p>

      {/* Search and Filters */}
      <div className="mb-8">
        <CraftsFilters
          categories={categories || []}
          regions={regions || []}
          categoryId={categoryId}
          regionId={regionId}
          isGiTagged={isGiTagged}
          searchQuery={searchQuery}
        />
      </div>

      {/* Crafts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {crafts && crafts.length > 0 ? (
          // @ts-ignore
          crafts.map((craft) => <CraftCard key={craft.id} craft={craft} />)
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No crafts found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or search term
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <nav aria-label="Pagination" className="flex space-x-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              const isCurrentPage = page === currentPage;

              // Create new URL with updated search params
              const params = new URLSearchParams();
              for (const [key, value] of Object.entries(searchParams)) {
                if (value) params.set(key, value);
              }
              params.set("page", page.toString());
              const url = `/crafts?${params.toString()}`;

              return (
                <a
                  key={page}
                  href={url}
                  aria-current={isCurrentPage ? "page" : undefined}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium ${
                    isCurrentPage
                      ? "bg-indigo-600 text-white"
                      : "border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
