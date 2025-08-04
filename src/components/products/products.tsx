"use client";

import { Products as ProductsType } from "@/types/product";
import React, { useEffect, useRef, useState } from "react";
import { Product } from "./product";

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function Products({
  initialProducts,
  autoFocus
}: {
  initialProducts: ProductsType;
  autoFocus?: boolean;
}) {
  const [visibleProducts ] = useState<
    ProductsType | undefined
  >(initialProducts ? shuffleArray(initialProducts) : undefined);
  const inputRef = useRef<HTMLInputElement>(null);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
