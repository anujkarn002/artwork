import { createServerSupabaseClient } from "@/lib/supabase/server";
import DashboardStats from "@/components/dashboard/dashboard-stats";
import DashboardOverview from "@/components/dashboard/dashboard-overview";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Artwork",
  description: "Manage your Artwork account",
};

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null; // This should be handled by middleware, but just in case
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get stats based on user role
  let stats = {
    totalOrders: 0,
    pendingOrders: 0,
    totalSales: 0,
    totalProducts: 0,
  };

  // For artisans, get sales and product stats
  if (profile?.role === "artisan") {
    // Get total products
    const { count: productsCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("artisan_id", user.id);

    // Get orders stats (simplified - in a real app, you'd aggregate from order_items)
    const { data: orders } = await supabase
      .from("orders")
      .select("id, status, total_amount")
      .eq("customer_id", user.id); // This should actually filter orders containing artisan's products

    const pendingOrders =
      orders?.filter((order) =>
        ["pending", "processing"].includes(order.status)
      ).length || 0;

    const totalSales =
      orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

    stats = {
      totalOrders: orders?.length || 0,
      pendingOrders,
      totalSales,
      totalProducts: productsCount || 0,
    };
  } else {
    // For customers, get order stats
    const { data: orders } = await supabase
      .from("orders")
      .select("id, status, total_amount")
      .eq("customer_id", user.id);

    const pendingOrders =
      orders?.filter((order) =>
        ["pending", "processing"].includes(order.status)
      ).length || 0;

    const totalSpent =
      orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

    stats = {
      totalOrders: orders?.length || 0,
      pendingOrders,
      totalSales: totalSpent, // For customers, this is total spent
      totalProducts: 0,
    };
  }

  // Get recent activity
  // For simplicity, we're just getting orders, but this could include other activities
  const { data: recentActivity } = await supabase
    .from("orders")
    .select("id, status, total_amount, created_at")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back,{" "}
          {profile?.full_name || user.email?.split("@")[0] || "User"}!
        </p>
      </div>

      <DashboardStats stats={stats} userRole={profile?.role || "customer"} />

      <DashboardOverview
        recentActivity={recentActivity || []}
        userRole={profile?.role || "customer"}
      />
    </div>
  );
}
