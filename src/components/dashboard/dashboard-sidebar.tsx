"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  FileText,
  PaintBucket,
  Palette,
  Award,
  BookOpen,
  ShieldCheck,
} from "lucide-react";

interface LinkItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  requiresVerification?: boolean;
}

interface DashboardSidebarProps {
  isArtisan: boolean;
  isAdmin: boolean;
  artisanVerified?: boolean;
}

export default function DashboardSidebar({
  isArtisan,
  isAdmin,
  artisanVerified,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  // Common links for all users
  const commonLinks: LinkItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Orders",
      href: "/dashboard/orders",
      icon: ShoppingBag,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  // Links for artisans
  const artisanLinks = [
    {
      name: "Products",
      href: "/dashboard/products",
      icon: Palette,
      requiresVerification: true,
    },
    {
      name: "My Profile",
      href: "/dashboard/artisan-profile",
      icon: Award,
      requiresVerification: false,
    },
  ];

  // Links for admins
  const adminLinks: LinkItem[] = [
    {
      name: "Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      name: "Crafts Management",
      href: "/dashboard/admin/crafts",
      icon: PaintBucket,
    },
    {
      name: "Verification Requests",
      href: "/dashboard/admin/verifications",
      icon: ShieldCheck,
    },
    {
      name: "Cultural Documentation",
      href: "/dashboard/admin/documentation",
      icon: BookOpen,
    },
  ];

  // Determine which links to show based on user role
  let links = [...commonLinks];

  if (isArtisan) {
    // Filter out artisan links based on verification status if needed
    const filteredArtisanLinks = artisanLinks.filter(
      (link) => !link.requiresVerification || artisanVerified
    );

    links = [...links, ...filteredArtisanLinks];
  }

  if (isAdmin) {
    links = [...links, ...adminLinks];
  }

  return (
    <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block">
      <div className="h-full py-6 pr-6 md:py-8">
        <nav className="flex flex-col space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
                !artisanVerified &&
                  link.requiresVerification &&
                  "opacity-50 cursor-not-allowed"
              )}
              {...(!artisanVerified && link.requiresVerification
                ? { onClick: (e) => e.preventDefault() }
                : {})}
            >
              <link.icon className="h-4 w-4" />
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
