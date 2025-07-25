import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Prodfind",
  description: "Contact to Prodfind Team.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}