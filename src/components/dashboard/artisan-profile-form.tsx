"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Profile, ArtisanProfile, Craft } from "@/types/database";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Upload, PlusCircle, Award, Delete } from "lucide-react";
import { toast } from "sonner";

// Define award and certificate schemas
const awardSchema = z.object({
  name: z.string().min(1, "Award name is required"),
  year: z.string(),
  description: z.string().optional(),
});

const certificateSchema = z.object({
  name: z.string().min(1, "Certificate name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  year: z.string(),
  certificate_url: z.string().optional(),
});

// Define the artisan profile schema
const artisanProfileSchema = z.object({
  // Basic user profile fields
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  location: z.string().min(2, "Location is required"),
  avatar_url: z.string().optional(),

  // Artisan-specific fields
  craft_id: z.string().uuid("Please select a craft"),
  experience_years: z.coerce
    .number()
    .int()
    .min(0, "Experience cannot be negative"),
  awards: z.array(awardSchema).optional().default([]),
  certificates: z.array(certificateSchema).optional().default([]),
  is_master_artisan: z.boolean().default(false),
  story: z.string().min(50, "Story must be at least 50 characters"),
});

type ArtisanProfileFormValues = z.infer<typeof artisanProfileSchema>;

interface ArtisanProfileFormProps {
  userProfile: Profile | null;
  artisanProfile: ArtisanProfile | null;
  crafts: Pick<Craft, "id" | "name">[];
}

export default function ArtisanProfileForm({
  userProfile,
  artisanProfile,
  crafts,
}: ArtisanProfileFormProps) {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const { uploadFile, isUploading } = useFileUpload();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Get initial values from existing profiles
  const defaultValues: Partial<ArtisanProfileFormValues> = {
    full_name: userProfile?.full_name || "",
    bio: userProfile?.bio || "",
    location: userProfile?.location || "",
    avatar_url: userProfile?.avatar_url || "",

    craft_id: artisanProfile?.craft_id || "",
    experience_years: artisanProfile?.experience_years || 0,
    awards: (artisanProfile?.awards as any[]) || [],
    certificates: (artisanProfile?.certificates as any[]) || [],
    is_master_artisan: artisanProfile?.is_master_artisan || false,
    story: artisanProfile?.story || "",
  };

  const form = useForm<ArtisanProfileFormValues>({
    resolver: zodResolver(artisanProfileSchema),
    defaultValues,
  });

  // Handle new award fields
  const [newAward, setNewAward] = useState({
    name: "",
    year: "",
    description: "",
  });

  const [newCertificate, setNewCertificate] = useState({
    name: "",
    issuer: "",
    year: "",
    certificate_url: "",
  });

  // Add a new award to the form
  const addAward = () => {
    if (!newAward.name || !newAward.year) {
      toast.error("Award name and year are required");
      return;
    }

    const currentAwards = form.getValues("awards") || [];
    form.setValue("awards", [...currentAwards, newAward]);

    // Reset the new award fields
    setNewAward({
      name: "",
      year: "",
      description: "",
    });
  };

  // Remove an award from the form
  const removeAward = (index: number) => {
    const currentAwards = form.getValues("awards") || [];
    form.setValue(
      "awards",
      currentAwards.filter((_, i) => i !== index)
    );
  };

  // Add a new certificate to the form
  const addCertificate = () => {
    if (
      !newCertificate.name ||
      !newCertificate.issuer ||
      !newCertificate.year
    ) {
      toast.error("Certificate name, issuer, and year are required");
      return;
    }

    const currentCertificates = form.getValues("certificates") || [];
    form.setValue("certificates", [...currentCertificates, newCertificate]);

    // Reset the new certificate fields
    setNewCertificate({
      name: "",
      issuer: "",
      year: "",
      certificate_url: "",
    });
  };

  // Remove a certificate from the form
  const removeCertificate = (index: number) => {
    const currentCertificates = form.getValues("certificates") || [];
    form.setValue(
      "certificates",
      currentCertificates.filter((_, i) => i !== index)
    );
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadFile(file, {
      bucket: "avatars",
      onSuccess: (url) => {
        toast.success("Avatar uploaded successfully");
        form.setValue("avatar_url", url);
      },
      onError: (error) => {
        toast.error(`Failed to upload avatar: ${error}`);
      },
    });
  };

  // Handle certificate upload
  const handleCertificateUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadFile(file, {
      bucket: "documents",
      onSuccess: (url) => {
        toast.success("Certificate uploaded successfully");
        setNewCertificate({ ...newCertificate, certificate_url: url });
      },
      onError: (error) => {
        toast.error(`Failed to upload certificate: ${error}`);
      },
    });
  };

  // Handle form submission
  const onSubmit = async (values: ArtisanProfileFormValues) => {
    setIsSubmitting(true);

    try {
      // First, update the user profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: values.full_name,
          bio: values.bio,
          location: values.location,
          avatar_url: values.avatar_url,
          // If user is not already an artisan, update their role
          ...(userProfile?.role !== "artisan" ? { role: "artisan" } : {}),
        })
        .eq("id", userProfile?.id as string);

      if (profileError) throw profileError;

      if (artisanProfile) {
        // Update existing artisan profile
        const { error: artisanError } = await supabase
          .from("artisan_profiles")
          .update({
            craft_id: values.craft_id,
            experience_years: values.experience_years,
            awards: values.awards,
            certificates: values.certificates,
            is_master_artisan: values.is_master_artisan,
            story: values.story,
            // If profile was rejected, set status back to pending
            ...(artisanProfile.verification_status === "rejected"
              ? { verification_status: "pending" }
              : {}),
          })
          .eq("id", userProfile?.id as string);

        if (artisanError) throw artisanError;

        toast.success("Artisan profile updated successfully");
      } else {
        // Create new artisan profile
        const { error: artisanError } = await supabase
          .from("artisan_profiles")
          .insert({
            id: userProfile?.id as string,
            craft_id: values.craft_id,
            experience_years: values.experience_years,
            awards: values.awards,
            certificates: values.certificates,
            is_master_artisan: values.is_master_artisan,
            story: values.story,
            verification_status: "pending",
          });

        if (artisanError) throw artisanError;

        toast.success("Artisan profile created successfully");

        // Show confirmation dialog for new profiles
        setShowConfirmDialog(true);
      }

      // Refresh the page to show updated profile
      router.refresh();
    } catch (error: any) {
      console.error("Error saving artisan profile:", error);
      toast.error(
        `Failed to save profile: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Your basic information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <FormField
                    control={form.control}
                    name="avatar_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Avatar className="h-20 w-20">
                              <AvatarImage
                                src={field.value || ""}
                                alt="Profile"
                              />
                              <AvatarFallback>
                                {userProfile?.full_name
                                  ? userProfile.full_name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()
                                  : "A"}
                              </AvatarFallback>
                            </Avatar>
                            <label
                              htmlFor="avatar-upload"
                              className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer"
                            >
                              <Upload className="h-4 w-4" />
                              <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarUpload}
                                disabled={isUploading}
                              />
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, State, Country" {...field} />
                      </FormControl>
                      <FormDescription>
                        Where you are based and practice your craft
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A brief introduction about yourself"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A short introduction that appears in your profile
                        summary
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Craft Information */}
            <Card>
              <CardHeader>
                <CardTitle>Craft Information</CardTitle>
                <CardDescription>
                  Details about your craft expertise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="craft_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Craft</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your primary craft" />
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
                        The traditional craft you specialize in
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience_years"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormDescription>
                        How many years you have been practicing this craft
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_master_artisan"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </FormControl>
                      <div>
                        <FormLabel>Master Artisan</FormLabel>
                        <FormDescription className="text-xs">
                          I am recognized as a master in my craft tradition
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="story"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Craft Story</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your journey with this craft..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Tell your story - how you learned the craft, what it
                        means to you, and the cultural significance
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Awards and Certificates Section */}
          <Card>
            <CardHeader>
              <CardTitle>Awards & Credentials</CardTitle>
              <CardDescription>
                Add your awards, certificates, and recognitions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Awards Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Awards & Recognitions
                </h3>

                <div className="space-y-4 mb-6">
                  {form.watch("awards")?.map((award, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 border rounded-md"
                    >
                      <Award className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{award.name}</h4>
                          <Badge variant="outline">{award.year}</Badge>
                        </div>
                        {award.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {award.description}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAward(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Award Name"
                    value={newAward.name}
                    onChange={(e) =>
                      setNewAward({ ...newAward, name: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Year"
                    value={newAward.year}
                    onChange={(e) =>
                      setNewAward({ ...newAward, year: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Description (Optional)"
                    value={newAward.description}
                    onChange={(e) =>
                      setNewAward({ ...newAward, description: e.target.value })
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={addAward}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Award
                </Button>
              </div>

              {/* Certificates Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Certificates & Training
                </h3>

                <div className="space-y-4 mb-6">
                  {form.watch("certificates")?.map((certificate, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 border rounded-md"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{certificate.name}</h4>
                          <Badge variant="outline">{certificate.year}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Issued by: {certificate.issuer}
                        </p>
                        {certificate.certificate_url && (
                          <p className="text-xs text-blue-600 mt-1 hover:underline">
                            <a
                              href={certificate.certificate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Certificate
                            </a>
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCertificate(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Certificate Name"
                    value={newCertificate.name}
                    onChange={(e) =>
                      setNewCertificate({
                        ...newCertificate,
                        name: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Issuing Organization"
                    value={newCertificate.issuer}
                    onChange={(e) =>
                      setNewCertificate({
                        ...newCertificate,
                        issuer: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Year"
                    value={newCertificate.year}
                    onChange={(e) =>
                      setNewCertificate({
                        ...newCertificate,
                        year: e.target.value,
                      })
                    }
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Certificate URL (Optional)"
                      value={newCertificate.certificate_url}
                      onChange={(e) =>
                        setNewCertificate({
                          ...newCertificate,
                          certificate_url: e.target.value,
                        })
                      }
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="shrink-0"
                      onClick={(e) => {
                        const input = document.getElementById(
                          "certificate-upload"
                        ) as HTMLInputElement;
                        input?.click();
                      }}
                    >
                      <Upload className="h-4 w-4" />
                      <input
                        id="certificate-upload"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={handleCertificateUpload}
                        disabled={isUploading}
                      />
                    </Button>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={addCertificate}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Certificate
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : artisanProfile
                ? "Update Profile"
                : "Create Artisan Profile"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Profile Submitted for Verification
            </AlertDialogTitle>
            <AlertDialogDescription>
              Thank you for creating your artisan profile! Your profile has been
              submitted for verification. Our team will review your details and
              approve your profile within 1-2 business days. You'll be notified
              once your profile is verified and you can start selling products.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => router.push("/dashboard")}>
              Return to Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
