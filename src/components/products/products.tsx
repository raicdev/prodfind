"use client";

import { Products as ProductsType } from "@/types/product";
import { randomUUID } from "node:crypto";
import React, { useEffect } from "react";
import { Product } from "./product";
import { Input } from "../ui/input";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useAuth } from "@/context/auth-context";

export function Products({
  dashboard,
  forceRefresh,
  initialProducts,
}: {
  dashboard?: boolean;
  forceRefresh?: string;
  initialProducts?: ProductsType;
}) {
  const { session } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [products, setProducts] = React.useState<ProductsType>(initialProducts || []);
  const [visibleProducts, setVisibleProducts] = React.useState<
    ProductsType | undefined
  >(initialProducts || []);

  const {
    data,
    isLoading,
    refetch,
  } = trpc.getProducts.useQuery(
    {
      userId: dashboard ? session?.user?.id : undefined,
    },
    { enabled: !initialProducts }
  );

  useEffect(() => {
    if (forceRefresh) {
      refetch();
    }
  }, [forceRefresh, refetch]);

  useEffect(() => {
    if (data && !initialProducts) {
      setProducts(data as unknown as ProductsType);
      setVisibleProducts(data as unknown as ProductsType);
    }
  }, [data, initialProducts]);

  if (isLoading && !initialProducts) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 w-full mb-4",
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        )}
      >
        <Search size={16} className="text-muted-foreground" />
        <input
          value={searchQuery}
          className="border-none outline-none resize-none w-full"
          onChange={(e) => {
            setSearchQuery(e.target.value);
            const filteredProducts = products.filter((product) => {
              return product.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            });
            setVisibleProducts(filteredProducts);
          }}
          placeholder="Search products..."
          aria-label="Search products"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {visibleProducts?.length === 0 ? (
          <Product product={null} />
        ) : (
          visibleProducts?.map((product) => (
            <Product key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}
