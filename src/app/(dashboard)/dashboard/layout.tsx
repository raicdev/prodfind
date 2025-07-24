import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Prodfind",
  description: "Dashboard of Prodfind.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}