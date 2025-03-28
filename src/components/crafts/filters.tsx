"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchIcon } from "lucide-react";
import CraftPill from "@/components/shared/craft-pill";

interface FiltersProps {
  categories: { id: string; name: string }[];
  regions: { id: string; name: string; state: string }[];
  categoryId?: string;
  regionId?: string;
  isGiTagged: boolean;
  searchQuery: string;
}

export default function CraftsFilters({
  categories,
  regions,
  categoryId,
  regionId,
  isGiTagged,
  searchQuery,
}: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper to update URL params
  const updateSearchParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // Reset to page 1 when filters change
    params.delete("page");

    router.push(`/crafts?${params.toString()}`);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <form action="/crafts" method="get">
            <Input
              name="search"
              type="text"
              placeholder="Search crafts..."
              defaultValue={searchQuery}
              className="pr-10"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0"
            >
              <SearchIcon className="h-5 w-5 text-gray-500" />
            </Button>

            {/* Preserve other filter values */}
            {categoryId && (
              <input type="hidden" name="category" value={categoryId} />
            )}
            {regionId && <input type="hidden" name="region" value={regionId} />}
            {isGiTagged && (
              <input type="hidden" name="gi_tagged" value="true" />
            )}
          </form>
        </div>

        <div className="flex gap-2">
          <Select
            name="category"
            defaultValue={categoryId || "all"}
            onValueChange={(value) =>
              updateSearchParams("category", value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Craft Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            name="region"
            defaultValue={regionId || "all"}
            onValueChange={(value) =>
              updateSearchParams("region", value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions?.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}, {region.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2 border rounded-md px-3">
            <Checkbox
              id="gi_tagged"
              checked={isGiTagged}
              onCheckedChange={(checked) => {
                updateSearchParams("gi_tagged", checked ? "true" : null);
              }}
            />
            <label
              htmlFor="gi_tagged"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              GI Tagged
            </label>
          </div>
        </div>
      </div>

      {/* Quick filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <CraftPill
          craft={{ id: "", name: "All Crafts" }}
          isActive={!categoryId}
        />
        {categories?.slice(0, 8).map((category) => (
          <CraftPill
            key={category.id}
            craft={category}
            isActive={categoryId === category.id}
          />
        ))}
      </div>
    </>
  );
}
