import { Suspense } from "react"
import { Products } from "@/components/products/products"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Explore Products",
  description: "Discover and explore the latest products",
}

export default function ExplorePage() {
  return (
    <div className="py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Explore Products</h1>
        <p className="mt-2 text-muted-foreground">
          Discover and explore the latest products from creators around the world.
        </p>
      </div>
      
      <Suspense fallback={
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <Skeleton className="h-40 w-full rounded-md" />
              <Skeleton className="mt-4 h-6 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
            </div>
          ))}
        </div>
      }>
        <Products />
      </Suspense>
    </div>
  )
}
