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
} from "lucide-react"

const data = {
    navMain: [
        {
            title: "Home",
            url: "#",
            icon: House,
        },
        {
            title: "Ranking",
            url: "#",
            icon: Trophy,
        },
        {
            title: "New",
            url: "#",
            icon: PackagePlus,
        },
        {
            title: "Recommended",
            url: "#",
            icon: Sparkles,
        },
        {
            title: "Upcoming",
            url: "#",
            icon: Hourglass,
        },
        {
            title: "",
            url: "",
        },
        {
            title: "Notifications",
            url: "#",
            icon: Bell,
        },
        {
            title: "Bookmarks",
            url: "#",
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
