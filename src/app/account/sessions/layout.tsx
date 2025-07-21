import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sessions - Prodfind",
  description: "Manage your active sessions.",
};

export default function SessionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}