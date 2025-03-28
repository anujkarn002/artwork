"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Craft, Product } from "@/types/database";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";

const productSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must not exceed 100 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be greater than zero."),
  discount_price: z.coerce
    .number()
    .positive("Discount price must be greater than zero.")
    .optional()
    .nullable(),
  craft_id: z.string().uuid("Please select a craft category."),
  materials: z.array(z.string()).optional(),
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  creation_time: z.string().optional(),
  stock_quantity: z.coerce.number().int().min(0, "Stock cannot be negative."),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  image_urls: z
    .array(z.string())
    .min(1, "At least one product image is required."),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  crafts: Pick<Craft, "id" | "name">[];
  product?: Product;
  isEditing?: boolean;
  defaultCraftId?: string;
}

export default function ProductForm({
  crafts,
  product,
  isEditing = false,
  defaultCraftId,
}: ProductFormProps) {
  const router = useRouter();
  const { uploadFile, isUploading, error: uploadError } = useFileUpload();
  const [newMaterial, setNewMaterial] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  // Convert materials from JSON to array if needed
  const getMaterials = () => {
    if (!product?.materials) return [];

    if (typeof product.materials === "string") {
      try {
        return JSON.parse(product.materials);
      } catch {
        return (product.materials as string)
          ?.split(",")
          .map((item) => item.trim());
      }
    }

    return product.materials as string[];
  };

  // Initialize form with existing product data or defaults
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      discount_price: product?.discount_price || null,
      craft_id: product?.craft_id || defaultCraftId || "",
      materials: getMaterials(),
      dimensions: product?.dimensions || "",
      weight: product?.weight || "",
      creation_time: product?.creation_time || "",
      stock_quantity: product?.stock_quantity ?? 1,
      is_available: product?.is_available ?? true,
      is_featured: product?.is_featured ?? false,
      image_urls: product?.image_urls || [],
    },
  });

  const imageUrls = form.watch("image_urls");

  const addMaterial = () => {
    if (!newMaterial.trim()) return;

    const currentMaterials = form.getValues("materials") || [];
    form.setValue("materials", [...currentMaterials, newMaterial.trim()]);
    setNewMaterial("");
  };

  const removeMaterial = (index: number) => {
    const currentMaterials = form.getValues("materials") || [];
    form.setValue(
      "materials",
      currentMaterials.filter((_, i) => i !== index)
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageUploading(true);

    try {
      const currentImages = form.getValues("image_urls") || [];
      const newImages = [...currentImages];

      // Upload each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await uploadFile(file, {
          bucket: "products",
          onSuccess: (url) => {
            toast.success(`Image ${i + 1} uploaded successfully`);
          },
          onError: (error) => {
            toast.error(`Failed to upload image ${i + 1}: ${error}`);
          },
        });

        if (result?.url) {
          newImages.push(result.url);
        }
      }

      form.setValue("image_urls", newImages);
      form.trigger("image_urls");
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload one or more images. Please try again.");
    } finally {
      setImageUploading(false);
      // Reset the input value to allow uploading the same file again
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("image_urls") || [];
    form.setValue(
      "image_urls",
      currentImages.filter((_, i) => i !== index)
    );
    form.trigger("image_urls");
  };

  async function onSubmit(values: ProductFormValues) {
    try {
      const supabase = createBrowserSupabaseClient();

      if (isEditing && product) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update(values)
          .eq("id", product.id);

        if (error) throw error;

        toast.success("Product updated successfully");
      } else {
        // Create new product
        const { error } = await supabase.from("products").insert(values);

        if (error) throw error;

        toast.success("Product created successfully");
      }

      // Redirect to products page
      router.push("/dashboard/products");
      router.refresh();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(
        `Failed to ${isEditing ? "update" : "create"} product: ${
          error.message || "Unknown error"
        }`
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Product Details Section */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                  Basic information about your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Handwoven Pashmina Shawl"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A clear, descriptive name for your product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your product in detail..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include details about technique, history, and cultural
                        significance.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="craft_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Craft Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a craft category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {crafts.map((craft) => (
                            <SelectItem key={craft.id} value={craft.id}>
                              {craft.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the traditional craft category for your product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
                <CardDescription>
                  Set your product's price and availability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discount_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sale Price (₹) (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={field.value === null ? "" : field.value}
                            onChange={(e) => {
                              const value =
                                e.target.value === ""
                                  ? null
                                  : parseFloat(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="stock_quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="1"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Number of items available for sale.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col space-y-4">
                  <FormField
                    control={form.control}
                    name="is_available"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Publish product</FormLabel>
                          <FormDescription>
                            Make this product visible on the marketplace.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Featured product</FormLabel>
                          <FormDescription>
                            Highlight this product in featured sections.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Images & Additional Details Section */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>
                  High-quality images help your products sell faster
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="image_urls"
                  render={() => (
                    <FormItem>
                      <FormLabel>Product Images</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          {imageUrls &&
                            imageUrls.map((url, index) => (
                              <div
                                key={index}
                                className="relative aspect-square border rounded-md overflow-hidden"
                              >
                                <img
                                  src={url}
                                  alt={`Product image ${index + 1}`}
                                  className="object-cover w-full h-full"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          <label className="border border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer aspect-square hover:bg-gray-50">
                            <div className="flex flex-col items-center justify-center p-4 text-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm font-medium">Add Image</p>
                              <p className="text-xs text-muted-foreground">
                                {imageUploading
                                  ? "Uploading..."
                                  : "JPG, PNG or WebP, max 5MB"}
                              </p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                              multiple
                              disabled={imageUploading}
                            />
                          </label>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload at least one high-quality image of your product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
                <CardDescription>
                  Provide more information about your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <FormLabel>Materials</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.watch("materials")?.map((material, index) => (
                      <div
                        key={index}
                        className="bg-muted px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        <span>{material}</span>
                        <button
                          type="button"
                          onClick={() => removeMaterial(index)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add material (e.g., Cotton, Silk)"
                      value={newMaterial}
                      onChange={(e) => setNewMaterial(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addMaterial();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addMaterial}
                    >
                      Add
                    </Button>
                  </div>
                  <FormDescription className="mt-2">
                    List the materials used in making this product.
                  </FormDescription>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dimensions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dimensions (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 20 x 30 cm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 500g" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="creation_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Creation Time (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 3-4 weeks handcrafted"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        How long it takes to create this item.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
