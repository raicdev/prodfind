"use client";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { User, Globe, KeyRound, Lock } from "lucide-react";
import UserMenu from "@/components/navbar-components/user-menu";

const links = [
  {
    label: "Account",
    href: "/account",
    icon: User,
  },
  {
    label: "Security",
    href: "/account/security",
    icon: Lock,
  },
  {
    label: "Sessions",
    href: "/account/sessions",
    icon: Globe,
  },
  {
    label: "Data",
    href: "/account/data",
    icon: KeyRound,
  },
];

export default function AccountLayout({
  session,
  children,
}: {
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (!session) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="text-xl font-semibold">Prodfind</div>
        <UserMenu />
      </header>
      <div className="grid md:grid-cols-[0.4fr_1fr] gap-8 p-4 mt-10 md:p-8 pb-24 md:pb-8">
        <aside className="hidden md:flex flex-col gap-2">
          <h1 className="text-2xl xl:text-3xl font-medium tracking-tight break-words">
            <span>Welcome, {session.user.name ? session.user.name : "Anonymous"}.</span>
            <br />
            <span className="text-muted-foreground">
              Manage your Prodfind account.
            </span>
          </h1>
          <nav className="flex flex-col gap-2 items-start mt-6">
            {links.map((link) => (
              <Button
                size={"lg"}
                variant={pathname === link.href ? "default" : "ghost"}
                asChild
                key={link.href}
                className="w-full max-w-2/3 justify-start"
              >
                <Link href={link.href}>
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            ))}
          </nav>
        </aside>
        <div className="w-full flex justify-center">
          <main className="w-full max-w-2xl">{children}</main>
        </div>
      </div>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-black border-neutral-800">
        <div className="grid grid-cols-4">
          {links.map((link) => {
            const isActive =
              link.href === "/account"
                ? pathname === link.href
                : pathname.startsWith(link.href);
            return (
              <Button
                variant={isActive ? "secondary" : "ghost"}
                asChild
                key={link.href}
                className="h-16 rounded-none"
              >
                <Link
                  href={link.href}
                  className="flex h-full w-full flex-col items-center justify-center gap-1"
                >
                  <link.icon className="h-5 w-5" />
                  <span className="text-xs">{link.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
