import { notFound } from "next/navigation";
import { trpc } from "@/trpc/server";
import { HydrateClient } from "@/trpc/server";
import { ProductDetail } from "@/components/product/product-detail";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  // Server-side data fetching
  let product, bookmarkStatus, recommendationStatus;

  try {
    [product, bookmarkStatus, recommendationStatus] = await Promise.all([
      trpc.getProduct({ productId: id }),
      trpc.getBookmarkStatus({ productId: id }).catch(() => null),
      trpc.getRecommendationStatus({ productId: id }).catch(() => null),
    ]);
  } catch (error) {
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <HydrateClient>
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <ProductDetail
          product={product}
          bookmarkStatus={bookmarkStatus}
          recommendationStatus={recommendationStatus}
        />
      </div>
    </HydrateClient>
  );
}