"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Menu,
  X,
  ShoppingCart,
  User as UserIcon,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  // Check for user session on component mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        // Fetch user profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }
      }
    };

    getUser();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session?.user) {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  // Get user's initials for avatar fallback
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((name: string) => name[0])
        .join("")
        .toUpperCase();
    }

    return user?.email?.charAt(0).toUpperCase() || "U";
  };

  return (
    <header className="bg-indigo-900 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
              K
            </div>
            <h1 className="ml-2 text-2xl font-bold text-white">Artwork</h1>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center w-1/3 relative">
            <form action="/search" method="get" className="w-full">
              <Input
                type="text"
                name="q"
                placeholder="Search crafts, products, artisans..."
                className="w-full text-gray-100 py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
              >
                <Search className="h-5 w-5 text-gray-200" />
              </Button>
            </form>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6 text-gray-200">
            <Link
              href="/"
              className={`hover:text-indigo-800 font-medium ${
                pathname === "/" ? "text-indigo-300" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/crafts"
              className={`hover:text-indigo-800 ${
                pathname?.startsWith("/crafts") ? "text-indigo-300" : ""
              }`}
            >
              Crafts
            </Link>
            <Link
              href="/products"
              className={`hover:text-indigo-800 ${
                pathname?.startsWith("/products") ? "text-indigo-300" : ""
              }`}
            >
              Shop
            </Link>
            <Link
              href="/artisans"
              className={`hover:text-indigo-800 ${
                pathname?.startsWith("/artisans") ? "text-indigo-300" : ""
              }`}
            >
              Artisans
            </Link>

            {/* Cart Icon */}
            <Button size="icon" variant="ghost" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={profile?.avatar_url || ""}
                        alt={profile?.full_name || user.email || "User"}
                      />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {profile?.full_name && (
                        <p className="font-medium">{profile.full_name}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Cart Icon for Mobile */}
            <Button size="icon" variant="ghost" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>

            {/* User Icon for Mobile - Shows dropdown or redirects to login */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={profile?.avatar_url || ""}
                        alt={profile?.full_name || user.email || "User"}
                      />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={handleSignOut}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/login">
                  <UserIcon className="h-5 w-5" />
                </Link>
              </Button>
            )}

            {/* Mobile menu toggle */}
            <Button
              className="md:hidden"
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <nav className="flex flex-col space-y-4 text-gray-600">
              <Link
                href="/"
                className={`hover:text-indigo-800 py-2 ${
                  pathname === "/" ? "text-indigo-800 font-medium" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/crafts"
                className={`hover:text-indigo-800 py-2 ${
                  pathname?.startsWith("/crafts")
                    ? "text-indigo-800 font-medium"
                    : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Crafts
              </Link>
              <Link
                href="/products"
                className={`hover:text-indigo-800 py-2 ${
                  pathname?.startsWith("/products")
                    ? "text-indigo-800 font-medium"
                    : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/artisans"
                className={`hover:text-indigo-800 py-2 ${
                  pathname?.startsWith("/artisans")
                    ? "text-indigo-800 font-medium"
                    : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Artisans
              </Link>

              {!user && (
                <>
                  <div className="border-t border-gray-200 pt-4 mt-2">
                    <Link
                      href="/login"
                      className="text-indigo-600 font-medium py-2 block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium block text-center mt-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}

        {/* Mobile Search (shown only on mobile) */}
        <div className="mt-4 md:hidden relative">
          <form action="/search" method="get">
            <Input
              type="text"
              name="q"
              placeholder="Search..."
              className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Search className="h-5 w-5 text-gray-500" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
