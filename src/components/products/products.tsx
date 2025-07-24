"use client";

import { Products as ProductsType } from "@/types/product";
import React, { useEffect, useRef, useState } from "react";
import { Product } from "./product";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function Products({
  initialProducts,
  autoFocus
}: {
  initialProducts: ProductsType;
  autoFocus?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleProducts, setVisibleProducts] = useState<
    ProductsType | undefined
  >(initialProducts);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialProducts) {
      const filteredProducts = initialProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setVisibleProducts(filteredProducts);
    }
  }, [searchQuery, initialProducts]);

  useEffect(() => {
    if (autoFocus) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          e.key.length === 1 && 
          !e.ctrlKey && 
          !e.altKey && 
          !e.metaKey && 
          document.activeElement !== inputRef.current
        ) {
          inputRef.current?.focus();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [autoFocus]);

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
          ref={inputRef}
          value={searchQuery}
          className="border-none outline-none resize-none w-full bg-transparent"
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          placeholder="Search products..."
          aria-label="Search products"
          autoFocus={autoFocus}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {visibleProducts && visibleProducts.length > 0 ? (
          visibleProducts.map((product) => (
            <Product key={product.id} product={product} />
          ))
        ) : (
          <Product product={null} />
        )}
      </div>
    </div>
  );
}
