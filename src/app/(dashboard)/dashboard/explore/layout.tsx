import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore - Prodfind",
  description: "Explore the latest products.",
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}