"use client";

import InfoMenu from "@/components/navbar-components/info-menu";
import NotificationMenu from "@/components/navbar-components/notification-menu";
import UserMenu from "@/components/navbar-components/user-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Header() {
  return (
    <header
      className={cn(
        "border-b px-4 md:px-6 transition-all duration-200 bg-background"
      )}
    >
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-xl font-semibold">
            Prodfind
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <InfoMenu />
            <NotificationMenu />
          </div>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
