"use client";

import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";
import { Loader2, UploadCloudIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  endpoint: keyof OurFileRouter;
  onClientUploadComplete?: (res?: any[]) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
}

export function UploadDropzone({
  endpoint,
  onClientUploadComplete,
  onUploadError,
  className,
}: UploadDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload, routeConfig } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      onClientUploadComplete?.(res);
      toast.success("Upload complete!");
    },
    onUploadError: (error: Error) => {
      setIsUploading(false);
      onUploadError?.(error);
      toast.error(`Upload failed: ${error.message}`);
    },
    onUploadBegin: () => {
      setIsUploading(true);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      startUpload(acceptedFiles);
    },
    [startUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-card/80 transition-colors",
        {
          "border-primary": isDragActive,
        },
        className
      )}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="mt-4 text-sm font-medium">Uploading...</p>
        </div>
      ) : isDragActive ? (
        <div className="flex flex-col items-center justify-center text-center">
            <p className="text-lg font-bold text-primary">Drop the files here ...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
            <UploadCloudIcon className="w-12 h-12 text-muted-foreground" />
            <p className="mt-4 text-sm font-medium">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">Select files from your computer</p>
            <p className="text-xs text-muted-foreground">Max upload {routeConfig?.image?.maxFileSize ? routeConfig.image.maxFileSize : 0}</p>
            <p className="text-xs text-muted-foreground">{routeConfig?.image?.minFileCount} ~ {routeConfig?.image?.maxFileCount} files allowed</p>
        </div>
      )}
    </div>
  );
}
