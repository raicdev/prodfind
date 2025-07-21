"use client";

import { Hero } from "@/components/hero";
import { Products } from "@/components/products/products";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const forceRefresh = searchParams.get("forceRefresh");

  return (
    <>
      <Hero />
      <Products forceRefresh={forceRefresh || undefined} />
    </>
  );
}
