import { Products } from "@/components/products/products";
import { trpc } from "@/trpc/server";
import { Products as ProductsType } from "@/types/product";

export default async function RecommendationsPage() {
  const recommendedProducts = await trpc.getRecommendedProducts() as ProductsType;

  return (
    <div className="py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Your Recommendations</h1>
        <p className="mt-2 text-muted-foreground">
          Here are all the products you have recommended.
        </p>
      </div>

      <Products initialProducts={recommendedProducts} />
    </div>
  );
}