import { Products } from "@/components/products/products";
import { auth } from "@/lib/auth";
import { trpc } from "@/trpc/server";
import { headers as getHeaders } from "next/headers";

export default async function ProductsPage() {
  const headers = await getHeaders();
  const session = await auth.api.getSession({ headers });
  const products = await trpc.getProducts({ userId: session?.user.id });

  return (
    <div className="py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Products</h1>
        <p className="mt-2 text-muted-foreground">
          Here are all your products.
        </p>
      </div>

      <Products initialProducts={products} />
    </div>
  );
}
