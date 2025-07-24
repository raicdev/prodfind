import { Hero } from "@/components/hero";
import Features from "@/components/features";
import { Products } from "@/components/products/products";
import { Products as ProductsType } from "@/types/product";
import { trpc } from "@/trpc/server";
import { CTA } from "@/components/cta";

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { ref: refer } = await searchParams;
  const products = await trpc.getProducts({}) as ProductsType;

  return (
    <>
      <Hero refer={refer as string || "default"} />
      <div className="container mx-auto py-12">
        <Products initialProducts={products} />
      </div>
      <Features />
      <CTA />
    </>
  );
}
