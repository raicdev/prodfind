"use client"

import * as React from "react"

import Logo from "@/components/logo";
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { NavNews } from "@/components/nav-news"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
} from "@/components/ui/sidebar"
import {
    House,
    Trophy,
    PackagePlus,
    Hourglass,
    Sparkles,
    Bookmark,
    Bell,
    Search,
} from "lucide-react"

const data = {
    navMain: [
        {
            title: "Home",
            url: "/",
            icon: House,
        },
        {
            title: "Ranking",
            url: "/ranking",
            icon: Trophy,
        },
        {
            title: "New",
            url: "/new",
            icon: PackagePlus,
        },
        {
            title: "Recommended",
            url: "/recommended",
            icon: Sparkles,
            invalid: true,
        },
        {
            title: "Upcoming",
            url: "/upcoming",
            icon: Hourglass,
            invalid: true,
        },
        {
            title: "",
            url: "",
        },
        {
            title: "Notifications",
            url: "/notifications",
            icon: Bell,
            invalid: true,
        },
        {
            title: "Bookmarks",
            url: "/dashboard/bookmarks",
            icon: Bookmark,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar className="bg-background" {...props}>
            <SidebarHeader className="bg-background">
                <SidebarMenu className="pt-2">
                    <Logo size={26} className="text-primary" />
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="bg-background">
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter className="bg-background pb-3">
                <NavNews />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
