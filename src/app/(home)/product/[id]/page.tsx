"use client";

import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import Link from "next/link";
import {
  SiGithub,
  SiX,
  SiProducthunt,
  SiAppstore,
  SiGoogleplay,
  SiDiscord,
  // SiLinkedin,
  SiFacebook,
  SiInstagram,
  SiYoutube,
} from "@icons-pack/react-simple-icons";
import {
  Globe,
  Link as LinkIconLucide,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Edit,
  Save,
  X,
  BadgeCheck,
  Trash2,
  Share2,
  Bookmark,
  Heart,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const LinkIcon = ({ link }: { link: { title: string; url: string } }) => {
  if (!link.title && !link.url)
    return <LinkIconLucide className="w-5 h-5 text-muted-foreground" />;

  const normalizedTitle = link.title.toLowerCase();
  const normalizedUrl = link.url.toLowerCase();

  if (
    normalizedTitle.includes("github") ||
    normalizedUrl.includes("github.com")
  )
    return <SiGithub className="w-5 h-5" />;
  if (
    normalizedTitle.includes("twitter") ||
    normalizedUrl.includes("x.com") ||
    normalizedUrl.includes("twitter.com")
  )
    return <SiX className="w-5 h-5" />;
  if (
    normalizedTitle.includes("product hunt") ||
    normalizedUrl.includes("producthunt.com")
  )
    return <SiProducthunt className="w-5 h-5" />;
  if (
    normalizedTitle.includes("app store") ||
    normalizedUrl.includes("apps.apple.com")
  )
    return <SiAppstore className="w-5 h-5" />;
  if (
    normalizedTitle.includes("google play") ||
    normalizedUrl.includes("play.google.com")
  )
    return <SiGoogleplay className="w-5 h-5" />;
  if (
    normalizedTitle.includes("discord") ||
    normalizedUrl.includes("discord.gg") ||
    normalizedUrl.includes("discord.com")
  )
    return <SiDiscord className="w-5 h-5" />;
  if (
    normalizedTitle.includes("facebook") ||
    normalizedUrl.includes("facebook.com")
  )
    return <SiFacebook className="w-5 h-5" />;
  if (
    normalizedTitle.includes("instagram") ||
    normalizedUrl.includes("instagram.com")
  )
    return <SiInstagram className="w-5 h-5" />;
  if (
    normalizedTitle.includes("youtube") ||
    normalizedUrl.includes("youtube.com")
  )
    return <SiYoutube className="w-5 h-5" />;
  if (normalizedTitle.includes("website") || normalizedUrl.includes("http"))
    return <Globe className="w-5 h-5" />;

  return <LinkIconLucide className="w-5 h-5 text-muted-foreground" />;
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
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

  const { data: bookmarkStatus, refetch: refetchBookmarkStatus } =
    trpc.getBookmarkStatus.useQuery({ productId }, { enabled: !!session });
  const { data: recommendationStatus, refetch: refetchRecommendationStatus } =
    trpc.getRecommendationStatus.useQuery(
      { productId },
      { enabled: !!session }
    );

  const addBookmarkMutation = trpc.addBookmark.useMutation({
    onSuccess: () => {
      toast.success("Added to your bag!");
      refetchBookmarkStatus();
    },
  });
  const removeBookmarkMutation = trpc.removeBookmark.useMutation({
    onSuccess: () => {
      toast.success("Removed from your bag.");
      refetchBookmarkStatus();
    },
  });
  const addRecommendationMutation = trpc.addRecommendation.useMutation({
    onSuccess: () => {
      toast.success("Recommended!");
      refetchRecommendationStatus();
    },
  });
  const removeRecommendationMutation = trpc.removeRecommendation.useMutation({
    onSuccess: () => {
      toast.success("Recommendation removed.");
      refetchRecommendationStatus();
    },
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const { startUpload: startIconUpload, isUploading: isIconUploading } =
    useUploadThing("iconUploader", {
      onClientUploadComplete: (res) => {
        if (res && res.length > 0) {
          setEditForm((prev) => ({ ...prev, icon: res[0].url }));
        }
        setIconFile([]);
      },
      onUploadError: (error: Error) => {
        alert(`ERROR! ${error.message}`);
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
        alert(`ERROR! ${error.message}`);
      },
    });

  const {
    data: product,
    isLoading,
    refetch,
  } = trpc.getProduct.useQuery({ productId }, { enabled: !!productId });

  const updateProductMutation = trpc.updateProduct.useMutation({
    onSuccess: () => {
      toast.success("Product updated successfully");
      setIsEditing(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update product");
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

  const handleToggleBookmark = () => {
    if (!session) {
      router.push("/auth/login");
      return;
    }
    if (bookmarkStatus?.isBookmarked) {
      removeBookmarkMutation.mutate({ productId });
    } else {
      addBookmarkMutation.mutate({ productId });
    }
  };

  const handleToggleRecommendation = () => {
    if (!session) {
      router.push("/auth/login");
      return;
    }
    if (recommendationStatus?.isRecommended) {
      removeRecommendationMutation.mutate({ productId });
    } else {
      addRecommendationMutation.mutate({ productId });
    }
  };

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-semibold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  const MainLink =
    product.links?.find(
      (link) =>
        link.title.toLowerCase() === "website" ||
        link.title.toLowerCase() === "live preview"
    ) || product.links?.[0];

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 md:gap-6 mb-8">
          {isEditing ? (
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
          ) : (
            product.icon && (
              <img
                src={product.icon}
                alt={product.name}
                width={96}
                height={96}
                className="rounded-lg w-24 h-24 object-cover flex-shrink-0"
              />
            )
          )}

          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="!text-3xl font-semibold border-none tracking-tight p-0 h-auto"
              />
            ) : (
              <h1 className="text-3xl font-semibold">{product.name}</h1>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {(isEditing
                ? editForm.category
                : (product.category as string[])
              )?.map((cat: string, index: number) => (
                <Badge key={index} variant="outline">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          {isOwner && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    size="sm"
                    disabled={updateProductMutation.isPending}
                  >
                    {" "}
                    <Save className="w-4 h-4 mr-1" /> Save{" "}
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    {" "}
                    <X className="w-4 h-4 mr-1" /> Cancel{" "}
                  </Button>
                </>
              ) : (
                <Button onClick={handleEdit} variant="outline" size="sm">
                  {" "}
                  <Edit className="w-4 h-4 mr-1" /> Edit{" "}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="creator">Creator</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="mt-6">
                {/* Image Gallery */}
                {isEditing ? (
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
                                images: prev.images.filter(
                                  (_, i) => i !== index
                                ),
                              }))
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  product.images &&
                  product.images.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">
                        Product Gallery
                      </h2>
                      <div className="relative">
                        <div
                          className="overflow-hidden rounded-lg"
                          ref={emblaRef}
                        >
                          <div className="flex">
                            {product.images.map((image: any) => (
                              <div
                                key={image.url}
                                className="relative aspect-video flex-[0_0_100%] md:flex-[0_0_50%] pl-4"
                              >
                                <img
                                  src={image.url}
                                  alt={product.name}
                                  className="object-cover w-full h-full rounded-md"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        {product.images.length > 2 && (
                          <>
                            <Button
                              variant="secondary"
                              size="icon"
                              onClick={scrollPrev}
                              className="absolute left-0 top-1/2 -translate-y-1/2 border"
                            >
                              <ChevronLeft />
                            </Button>
                            <Button
                              variant="secondary"
                              size="icon"
                              onClick={scrollNext}
                              className="absolute right-[-16] top-1/2 -translate-y-1/2 border"
                            >
                              <ChevronRight />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                )}
                {/* Description */}
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4">
                    About this product
                  </h2>
                  {isEditing ? (
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
                  ) : (
                    <p className="text-foreground/90 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="creator" className="mt-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Creator</h2>
                  <Card>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        {product.author.image && (
                          <Avatar>
                            <AvatarImage src={product.author.image} />
                            <AvatarFallback>
                              {product.author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div className="font-semibold flex items-center gap-1 text-lg">
                            {product.author.name}
                            {product.author.emailVerified && (
                              <BadgeCheck className="!w-5 !h-5 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-mono text-base">
                            {product.author.id.slice(0, 6)}...
                            {product.author.id.slice(-6)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        {product.author.emailVerified && (
                          <Badge className="text-sm">
                            <BadgeCheck className="!w-4 !h-4" /> Verified
                            Creator
                          </Badge>
                        )}
                      </div>
                      {/* {product.author.bio && (
                        <p className="mt-4 text-muted-foreground">
                          {product.author.bio}
                        </p>
                      )} */}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="links" className="mt-6">
                {/* Links */}
                {isEditing ? (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Links</h2>
                    <div className="space-y-4">
                      {editForm.links.map((link, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 border rounded-md bg-muted/50"
                        >
                          <Badge variant={index === 0 ? "default" : "outline"}>
                            {" "}
                            <LinkIcon link={link} />{" "}
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
                            {" "}
                            <Trash2 className="w-4 h-4 text-destructive" />{" "}
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
                      {" "}
                      Add Link{" "}
                    </Button>
                  </div>
                ) : (
                  product.links &&
                  product.links.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold">Links</h2>
                      <div className="grid grid-cols-1 gap-4">
                        {product.links.map((link: any) => (
                          <Card key={link.url} className="overflow-hidden">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block h-full"
                            >
                              <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-3">
                                    <LinkIcon link={link} />
                                    <span className="font-medium">
                                      {link.title}
                                    </span>
                                  </div>
                                  {link.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {link.description}
                                    </p>
                                  )}
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                              </CardContent>
                            </a>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column */}
          <div className="md:col-span-1 space-y-6">
            <div className="space-y-2">
              <Button
                size="lg"
                className="w-full"
                onClick={handleToggleRecommendation}
                disabled={
                  addRecommendationMutation.isPending ||
                  removeRecommendationMutation.isPending
                }
              >
                {recommendationStatus?.isRecommended ? (
                  <>
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />{" "}
                    Recommended
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4" /> Recommend
                  </>
                )}
              </Button>

              {MainLink && (
                <Button asChild size="lg" className="w-full">
                  <Link href={MainLink.url} target="_blank">
                    Visit Website <ExternalLink />
                  </Link>
                </Button>
              )}
            </div>

            <div className="flex items-center justify-around">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleToggleBookmark}
                disabled={
                  addBookmarkMutation.isPending ||
                  removeBookmarkMutation.isPending
                }
              >
                {bookmarkStatus?.isBookmarked ? (
                  <>
                    <Bookmark className="w-4 h-4 fill-primary" /> In Your Bag
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" /> Add to bag
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="flex-1 ml-2"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard");
                }}
              >
                <Share2 className="w-4 h-4" /> Share
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <img
                    src={product.author.image || "/avatar-placeholder.svg"}
                    alt={product.author.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold flex items-center gap-1">
                      {product.author.name}
                      {product.author.emailVerified && (
                        <BadgeCheck className="text-blue-500" size={16} />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">
                      {product.author.id.slice(0, 6)}...
                      {product.author.id.slice(-6)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {product.links && product.links.length > 0 && !isEditing && (
              <Card className="!gap-4">
                <CardHeader>
                  <CardTitle className="text-lg">Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {product.links.map((link: any) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 -mx-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <LinkIcon link={link} />
                          <span className="font-medium">{link.title}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {isOwner && isEditing && (
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
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this product.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        deleteProductMutation.mutate({ productId })
                      }
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
