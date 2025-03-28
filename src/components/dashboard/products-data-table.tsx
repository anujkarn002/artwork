"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { DataTable } from "@/components/dashboard/data-table";
import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import {
  CheckCircle,
  Edit,
  MoreHorizontal,
  Trash,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Define the product type based on what we get from Supabase
type Product = {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  stock_quantity: number;
  is_available: boolean;
  is_featured: boolean;
  created_at: string;
  craft: {
    id: string;
    name: string;
  } | null;
};

interface ProductsDataTableProps {
  products: Product[];
}

export default function ProductsDataTable({
  products,
}: ProductsDataTableProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedProduct) return;

    setIsLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", selectedProduct.id);

      if (error) {
        throw error;
      }

      toast.success("Product deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.");
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    try {
      const supabase = createBrowserSupabaseClient();

      const { error } = await supabase
        .from("products")
        .update({ is_available: !product.is_available })
        .eq("id", product.id);

      if (error) {
        throw error;
      }

      toast.success(
        `Product ${product.is_available ? "hidden" : "published"} successfully`
      );
      router.refresh();
    } catch (error) {
      console.error("Error updating product availability:", error);
      toast.error("Failed to update product. Please try again.");
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => {
        return (
          <div className="font-medium max-w-[250px] truncate">
            {row.original.name}
          </div>
        );
      },
    },
    {
      accessorKey: "craft.name",
      header: "Craft",
      cell: ({ row }) => {
        return <div>{row.original.craft?.name || "—"}</div>;
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const { price, discount_price } = row.original;

        if (discount_price) {
          return (
            <div className="flex flex-col">
              <span className="font-medium">₹{discount_price.toFixed(2)}</span>
              <span className="text-xs text-muted-foreground line-through">
                ₹{price.toFixed(2)}
              </span>
            </div>
          );
        }

        return <div className="font-medium">₹{price.toFixed(2)}</div>;
      },
    },
    {
      accessorKey: "stock_quantity",
      header: "Stock",
      cell: ({ row }) => {
        const quantity = row.original.stock_quantity;

        return (
          <div>
            {quantity === 0 ? (
              <Badge variant="destructive">Out of Stock</Badge>
            ) : quantity < 5 ? (
              <Badge
                variant="outline"
                className="text-amber-500 border-amber-500"
              >
                Low Stock: {quantity}
              </Badge>
            ) : (
              quantity
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "is_available",
      header: "Status",
      cell: ({ row }) => {
        const isAvailable = row.original.is_available;

        return (
          <div className="flex items-center">
            {isAvailable ? (
              <Badge
                variant="default"
                className="gap-1 bg-green-100 text-green-800 hover:bg-green-200"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Published</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1">
                <XCircle className="h-3.5 w-3.5" />
                <span>Hidden</span>
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Added",
      cell: ({ row }) => {
        return (
          <div>{format(new Date(row.original.created_at), "MMM d, yyyy")}</div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/products/${product.id}`} target="_blank">
                  View Product
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/products/${product.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleToggleAvailability(product)}
              >
                {product.is_available ? (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Hide Product
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Publish Product
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  setSelectedProduct(product);
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={products}
        searchField="name"
        searchPlaceholder="Search products..."
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product &quot;
              {selectedProduct?.name}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
