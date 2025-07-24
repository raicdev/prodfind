"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Product } from "@/types/product";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!product.images || product.images.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Product Gallery</h2>
      <div className="relative">
        <div className="overflow-hidden rounded-lg" ref={emblaRef}>
          <div className="flex">
            {product.images.map((image) => (
              <div
                key={image.url}
                className="relative aspect-video flex-[0_0_100%] md:flex-[0_0_50%] pl-4"
              >
                <img
                  src={image.url}
                  alt={product.name}
                  className="object-cover w-full h-full rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
        {product.images.length > 2 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 border"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={scrollNext}
              className="absolute right-[-16] top-1/2 -translate-y-1/2 border"
            >
              <ChevronRight />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}