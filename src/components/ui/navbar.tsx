"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
              A
            </div>
            <h1 className="ml-2 text-2xl font-bold text-indigo-800">Artwork</h1>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center w-1/3 relative">
            <input
              type="text"
              placeholder="Search crafts, regions, artisans..."
              className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="absolute right-3 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6 text-gray-600">
            <Link href="/" className="hover:text-indigo-800 font-medium">
              Home
            </Link>
            <Link href="/crafts" className="hover:text-indigo-800">
              Explore
            </Link>
            <Link href="/stories" className="hover:text-indigo-800">
              Stories
            </Link>
            <Link href="/artisans" className="hover:text-indigo-800">
              Artisans
            </Link>
            <Link href="/about" className="hover:text-indigo-800">
              About
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2">
            <nav className="flex flex-col space-y-2 text-gray-600">
              <Link href="/" className="hover:text-indigo-800 py-2">
                Home
              </Link>
              <Link href="/crafts" className="hover:text-indigo-800 py-2">
                Explore
              </Link>
              <Link href="/stories" className="hover:text-indigo-800 py-2">
                Stories
              </Link>
              <Link href="/artisans" className="hover:text-indigo-800 py-2">
                Artisans
              </Link>
              <Link href="/about" className="hover:text-indigo-800 py-2">
                About
              </Link>
            </nav>
          </div>
        )}

        {/* Mobile Search (shown only on mobile) */}
        <div className="mt-3 md:hidden relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="absolute right-3 top-2 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
