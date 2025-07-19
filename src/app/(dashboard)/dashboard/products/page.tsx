"use client";

import { Products } from "@/components/products/products";

export default function ProductsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <Products dashboard />
    </div>
  );
}
