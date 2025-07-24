import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features - Prodfind",
  description: "Features of Prodfind.",
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}