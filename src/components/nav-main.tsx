"use client"

import React from "react"
import Link from "next/link"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Search, type Icon } from "lucide-react"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: typeof Icon,
    }[]
}) {
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu className="mb-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 ml-0.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-8 pr-7"
                        />
                    </div>
                </SidebarMenu>
                <SidebarMenu>
                    {items.map((item) => (
                        item.title && item.url ? (
                            <SidebarMenuItem key={item.title}>
                                <Link className="w-full" href={item.url}>
                                    <SidebarMenuButton tooltip={item.title}>
                                        {item.icon ? React.createElement(item.icon) : null}
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        ) : (
                            <div className="py-1.5" key={item.title || Math.random()} />
                        )
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
