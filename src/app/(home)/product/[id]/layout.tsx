import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product - Prodfind",
  description: "Product details.",
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}