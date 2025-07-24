import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Product - Prodfind",
  description: "Create a new product.",
};

export default function NewProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}