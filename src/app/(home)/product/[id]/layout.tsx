import { trpc } from "@/trpc/server";
import { Metadata } from "next";

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
  const { id } = await params;
  const product = await trpc.getProduct({ productId: id });

  if (!product) {
    return {
      title: "Product not found - Prodfind",
      description: "Product not found",
    };
  }

  return {
    title: `${product.name} - Prodfind`,
    description: product.description,
  };
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}