import { Hero } from "@/components/hero";
import { Products } from "@/components/products/products";
import { trpc } from "@/trpc/server";

export default async function Home() {
  const products = await trpc.getProducts({});

  return (
    <>
      <Hero />
      <Products initialProducts={products} />
    </>
  );
}
