import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type FileUploadState = {
  isUploading: boolean;
  progress: number;
  error: string | null;
  url: string | null;
  path: string | null;
};

type FileUploadOptions = {
  bucket: "avatars" | "products" | "crafts" | "documents";
  onSuccess?: (url: string, path: string) => void;
  onError?: (error: string) => void;
};

export function useFileUpload() {
  const [state, setState] = useState<FileUploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    url: null,
    path: null,
  });

  // Reset the state
  const reset = () => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      url: null,
      path: null,
    });
  };

  // Upload file using the API
  const uploadFile = async (file: File, options: FileUploadOptions) => {
    if (!file) return;

    setState({
      isUploading: true,
      progress: 0,
      error: null,
      url: null,
      path: null,
    });

    try {
      // Validate file type
      const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
      const allowedDocumentTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      const allowedTypes = [...allowedImageTypes, ...allowedDocumentTypes];

      if (!allowedTypes.includes(file.type)) {
        throw new Error("File type not supported");
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error("File size exceeds 5MB limit");
      }

      // Create form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", options.bucket);

      // Update progress to indicate request started
      setState((prev) => ({ ...prev, progress: 10 }));

      // Upload the file
      const response = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      // Simulate progress
      setState((prev) => ({ ...prev, progress: 50 }));

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload file");
      }

      // Complete progress
      setState((prev) => ({ ...prev, progress: 90 }));

      const data = await response.json();

      // Success
      setState({
        isUploading: false,
        progress: 100,
        error: null,
        url: data.url,
        path: data.path,
      });

      // Call the success callback if provided
      if (options.onSuccess) {
        options.onSuccess(data.url, data.path);
      }

      return data;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to upload file";

      setState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        url: null,
        path: null,
      });

      // Call the error callback if provided
      if (options.onError) {
        options.onError(errorMessage);
      }
    }
  };

  // Upload file directly to Supabase Storage (alternative approach)
  const uploadToStorage = async (file: File, options: FileUploadOptions) => {
    if (!file) return;

    setState({
      isUploading: true,
      progress: 0,
      error: null,
      url: null,
      path: null,
    });

    try {
      // Validate file type
      const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
      const allowedDocumentTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      const allowedTypes = [...allowedImageTypes, ...allowedDocumentTypes];

      if (!allowedTypes.includes(file.type)) {
        throw new Error("File type not supported");
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error("File size exceeds 5MB limit");
      }

      const supabase = createBrowserSupabaseClient();

      // Get user ID for filename
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Authentication required");
      }

      // Generate a unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      // Update progress to indicate upload started
      setState((prev) => ({ ...prev, progress: 10 }));

      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
          // TODO: See resumable uploads
          //   onUploadProgress: (progress) => {
          //     const progressPercentage = Math.round(
          //       (progress.loaded / progress.total) * 100
          //     );
          //     setState((prev) => ({ ...prev, progress: progressPercentage }));
          //   },
        });

      if (error) {
        throw error;
      }

      // Get the public URL for the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from(options.bucket).getPublicUrl(data.path);

      // Success
      setState({
        isUploading: false,
        progress: 100,
        error: null,
        url: publicUrl,
        path: data.path,
      });

      // Call the success callback if provided
      if (options.onSuccess) {
        options.onSuccess(publicUrl, data.path);
      }

      return { url: publicUrl, path: data.path };
    } catch (error: any) {
      const errorMessage = error.message || "Failed to upload file";

      setState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        url: null,
        path: null,
      });

      // Call the error callback if provided
      if (options.onError) {
        options.onError(errorMessage);
      }
    }
  };

  // Delete a file
  const deleteFile = async (
    path: string,
    bucket: FileUploadOptions["bucket"]
  ) => {
    try {
      const response = await fetch("/api/storage/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path, bucket }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete file");
      }

      return true;
    } catch (error: any) {
      console.error("Error deleting file:", error);
      return false;
    }
  };

  return {
    ...state,
    uploadFile,
    uploadToStorage,
    deleteFile,
    reset,
  };
}
