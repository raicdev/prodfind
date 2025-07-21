"use client";

import { Products } from "@/components/products/products";
import { trpc } from "@/trpc/client";
import { Loader2 } from "lucide-react";

export default function RecommendationsPage() {
  const { data: recommendedProducts, isLoading } =
    trpc.getRecommendedProducts.useQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Your Recommendations</h1>
        <p className="mt-2 text-muted-foreground">
          Here are all the products you have recommended.
        </p>
      </div>

      {recommendedProducts && <Products initialProducts={recommendedProducts as any} />}
    </div>
  );
} 