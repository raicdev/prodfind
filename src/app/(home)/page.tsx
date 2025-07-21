import { Hero } from "@/components/hero";
import { Products } from "@/components/products/products";
import { Products as ProductsType } from "@/types/product";
import { trpc } from "@/trpc/server";

export default async function Home() {
  const products = await trpc.getProducts({}) as ProductsType;

  return (
    <>
      <Hero />
      <Products initialProducts={products} />
    </>
  );
}
