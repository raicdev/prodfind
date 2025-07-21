import { Hero } from "@/components/hero";
import { Products } from "@/components/products/products";
import { Products as ProductsType } from "@/types/product";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { recommendations as recommendationsTable } from "@/lib/db/schema";
import { products as productsTable } from "@/lib/db/schema";

export default async function Home() {
  const recommendationCounts = db
    .select({
      productId: recommendationsTable.productId,
      count: sql<number>`count(${recommendationsTable.id})`
        .mapWith(Number)
        .as("count"),
    })
    .from(recommendationsTable)
    .groupBy(recommendationsTable.productId)
    .as("recommendationCounts");

  const qb = db
    .select({
      ...getTableColumns(productsTable),
      recommendationCount: recommendationCounts.count,
    })
    .from(productsTable)
    .leftJoin(
      recommendationCounts,
      eq(productsTable.id, recommendationCounts.productId)
    )
    .$dynamic();

  const products = (await qb.orderBy(desc(recommendationCounts.count))).map((p) => ({
    ...p,
    recommendationCount: p.recommendationCount || 0,
  })) as ProductsType;

  return (
    <>
      <Hero />
      <Products initialProducts={products} />
    </>
  );
}
