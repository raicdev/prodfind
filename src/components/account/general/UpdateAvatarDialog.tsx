"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";

type UpdateAvatarDialogProps = {
  children: React.ReactNode;
};

export function UpdateAvatarDialog({ children }: UpdateAvatarDialogProps) {
  const router = useRouter();

  const { startUpload, isUploading } = useUploadThing("avatarUploader", {
    onClientUploadComplete: () => {
      toast.success("Avatar updated successfully.");
      router.refresh();
    },
    onUploadError: (error: Error) => {
      toast.error(`ERROR! ${error.message}`);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    startUpload(acceptedFiles);
  }, [startUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} disabled={isUploading} />
      {children}
    </div>
  );
} 