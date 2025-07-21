"use client";

import { Products } from "@/components/products/products";

export default function ProductsPage() {
  return (
    <div className="py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Products</h1>
        <p className="mt-2 text-muted-foreground">
          Here are all your products.
        </p>
      </div>

      <Products dashboard />
    </div>
  );
}
