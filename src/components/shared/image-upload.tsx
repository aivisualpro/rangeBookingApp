"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { cn } from "@dashboardpack/core/lib/utils";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, label, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
         toast.error("File is too large (max 5MB)");
         return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");

        onChange(data.url);
      } catch (err: any) {
        toast.error(err.message || "Failed to upload image");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <label className="text-sm font-medium tracking-tight text-foreground">{label}</label>}
      {value ? (
        <div className="relative group overflow-hidden rounded-lg border border-border bg-muted/50 w-full aspect-video flex-shrink-0">
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img src={value} alt="Uploaded" className="object-cover w-full h-full transition duration-300 group-hover:scale-105" />
           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => onChange("")}
                className="bg-destructive/90 text-destructive-foreground hover:bg-destructive shadow-sm rounded-full p-2 backdrop-blur-md transition-transform active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
           </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/20 px-6 py-6 text-center transition-colors hover:bg-muted/50 hover:border-primary/50 aspect-video w-full outline-hidden",
            isDragActive && "border-primary bg-primary/5",
            uploading && "pointer-events-none opacity-60"
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/60" />
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-sm mb-3">
                <ImagePlus className="h-5 w-5 text-muted-foreground/80" />
              </div>
              <p className="text-sm font-medium">Click or drag image here</p>
              <p className="mt-1 text-xs text-muted-foreground">JPEG, PNG, WEBP (max 5MB)</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
