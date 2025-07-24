"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUploadThing } from "@/lib/uploadthing";
import { Edit, Save, X, Trash2, ExternalLink } from "lucide-react";

const LinkIcon = ({ link }: { link: { title: string; url: string } }) => {
  if (!link.title && !link.url)
    return <ExternalLink className="w-5 h-5 text-muted-foreground" />;
  // Link icon logic here - same as in original file
  return <ExternalLink className="w-5 h-5 text-muted-foreground" />;
};

interface ProductEditProps {
  product: any;
}

export function ProductEdit({ product }: ProductEditProps) {
  const router = useRouter();
  const { session } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [iconFile, setIconFile] = useState<File[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    category: [] as string[],
    links: [] as any[],
    images: [] as any[],
    icon: "",
  });

  const { startUpload: startIconUpload, isUploading: isIconUploading } =
    useUploadThing("iconUploader", {
      onClientUploadComplete: (res) => {
        if (res && res.length > 0) {
          setEditForm((prev) => ({ ...prev, icon: res[0].url }));
        }
        setIconFile([]);
      },
      onUploadError: (error: Error) => {
        toast.error(`ERROR! ${error.message}`);
      },
    });

  const { startUpload: startImageUpload, isUploading: isImageUploading } =
    useUploadThing("imageUploader", {
      onClientUploadComplete: (res) => {
        if (res) {
          const newImages = res.map((file) => ({
            id: crypto.randomUUID(),
            url: file.ufsUrl,
          }));
          setEditForm((prev) => ({
            ...prev,
            images: [...prev.images, ...newImages],
          }));
        }
        setImageFiles([]);
      },
      onUploadError: (error: Error) => {
        toast.error(`ERROR! ${error.message}`);
      },
    });

  const updateProductMutation = trpc.updateProduct.useMutation({
    onSuccess: () => {
      toast.success("Product updated successfully");
      setIsEditing(false);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to update product");
      } else {
        toast.error("Failed to update product");
      }
    },
  });

  const deleteProductMutation = trpc.deleteProduct.useMutation({
    onSuccess: () => {
      toast.success("Product deleted successfully");
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete product");
    },
  });

  const isOwner = session?.user?.id === product?.authorId;

  const handleEdit = () => {
    if (product) {
      setEditForm({
        name: product.name,
        description: product.description || "",
        price: product.price,
        category: (product.category as string[]) || [],
        links: product.links || [],
        images: product.images || [],
        icon: product.icon || "",
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (!product) return;

    updateProductMutation.mutate({
      productId: product.id,
      ...editForm,
      links: editForm.links.map(({ __typename, ...rest }) => rest),
      images: editForm.images.map(({ __typename, ...rest }) => rest),
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!isOwner) {
    return null;
  }

  return (
    <>
      {/* Edit Controls in Header */}
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button
              onClick={handleSave}
              size="sm"
              disabled={updateProductMutation.isPending}
            >
              <Save className="w-4 h-4 mr-1" /> Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
          </>
        ) : (
          <Button onClick={handleEdit} variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-1" /> Edit
          </Button>
        )}
      </div>

      {/* Edit Form Fields - Only render when editing */}
      {isEditing && (
        <>
          {/* Icon Upload */}
          <div className="w-24 h-24 flex-shrink-0">
            <label className="cursor-pointer">
              <img
                src={editForm.icon || product.icon || "/placeholder.svg"}
                alt="Icon Preview"
                width={96}
                height={96}
                className="rounded-lg object-cover w-full h-full"
              />
              <Input
                type="file"
                className="hidden"
                onChange={(e) =>
                  e.target.files && setIconFile(Array.from(e.target.files))
                }
              />
            </label>
            {iconFile.length > 0 && (
              <Button
                size="sm"
                className="w-full mt-1"
                onClick={() => startIconUpload(iconFile)}
                disabled={isIconUploading}
              >
                {isIconUploading ? "..." : "Upload"}
              </Button>
            )}
          </div>

          {/* Name Input */}
          <div className="flex-1">
            <Input
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              className="!text-3xl font-semibold border-none tracking-tight p-0 h-auto"
            />
          </div>

          {/* Image Gallery Edit */}
          <div>
            <label className="block text-2xl tracking-tight text-foreground font-semibold mb-2">
              Product Gallery
            </label>
            <div className="flex items-center gap-2 mb-4">
              <Input
                type="file"
                multiple
                onChange={(e) =>
                  e.target.files &&
                  setImageFiles(Array.from(e.target.files))
                }
              />
              <Button
                onClick={() => startImageUpload(imageFiles)}
                disabled={isImageUploading || imageFiles.length === 0}
              >
                {isImageUploading
                  ? "Uploading..."
                  : `Upload ${imageFiles.length} file(s)`}
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {editForm.images.map((image, index) => (
                <div key={image.url} className="relative aspect-video">
                  <img
                    src={image.url}
                    alt="Product image"
                    className="rounded-md object-cover w-full h-full"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() =>
                      setEditForm((prev) => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Description Edit */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">About this product</h2>
            <Textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  description: e.target.value,
                })
              }
              className="min-h-[150px]"
            />
          </div>

          {/* Links Edit */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Links</h2>
            <div className="space-y-4">
              {editForm.links.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 border rounded-md bg-muted/50"
                >
                  <Badge variant={index === 0 ? "default" : "outline"}>
                    <LinkIcon link={link} />
                  </Badge>
                  <Input
                    value={link.title}
                    placeholder="Link Title (e.g., App Store)"
                    onChange={(e) => {
                      const newLinks = [...editForm.links];
                      newLinks[index].title = e.target.value;
                      setEditForm((prev) => ({
                        ...prev,
                        links: newLinks,
                      }));
                    }}
                  />
                  <Input
                    value={link.url}
                    placeholder="https://..."
                    onChange={(e) => {
                      const newLinks = [...editForm.links];
                      newLinks[index].url = e.target.value;
                      setEditForm((prev) => ({
                        ...prev,
                        links: newLinks,
                      }));
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditForm((prev) => ({
                        ...prev,
                        links: prev.links.filter((_, i) => i !== index),
                      }));
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setEditForm((prev) => ({
                  ...prev,
                  links: [
                    ...prev.links,
                    { id: crypto.randomUUID(), title: "", url: "" },
                  ],
                }));
              }}
            >
              Add Link
            </Button>
          </div>

          {/* Delete Product */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full"
                disabled={deleteProductMutation.isPending}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Product
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this product.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    deleteProductMutation.mutate({ productId: product.id })
                  }
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
}