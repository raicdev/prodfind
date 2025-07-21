"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const navLinks = [
  { value: "dashboard", label: "Home", href: "/dashboard" },
  { value: "products", label: "Products", href: "/dashboard/products" },
  { value: "bookmarks", label: "Bookmarks", href: "/dashboard/bookmarks" },
  {
    value: "recommendations",
    label: "Recommendations",
    href: "/dashboard/recommendations",
  },
  { value: "explore", label: "Explore", href: "/explore" },
];

export default function TabsNav() {
  const pathname = usePathname();

  const getCurrentTab = () => {
    const current = navLinks.find((link) => link.href === pathname);
    return current ? current.value : "";
  };
  
  return (
    <div className="sticky top-0 z-50 border-b-2 shadow-sm bg-background p-2">
        <Tabs value={getCurrentTab()} className="w-full">
            <TabsList className="w-full justify-start p-0 bg-background overflow-x-auto">
            {navLinks.map((link) => (
              <TabsTrigger value={link.value} asChild key={link.value}>
                <Link href={link.href}>{link.label}</Link>
              </TabsTrigger>
            ))}
            </TabsList>
        </Tabs>
    </div>
  );
} 