"use client";

import InfoMenu from "@/components/navbar-components/info-menu";
import Logo from "@/components/navbar-components/logo";
import NotificationMenu from "@/components/navbar-components/notification-menu";
import UserMenu from "@/components/navbar-components/user-menu";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function Header() {
  return (
    <header
      className={cn(
        "border-b px-4 md:px-6 transition-all duration-200 bg-background"
      )}
    >
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <a href="/dashboard" className="text-primary hover:text-primary/90">
            <Logo />
          </a>
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
