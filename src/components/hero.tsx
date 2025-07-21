"use client";

import { Button } from "@/components/ui/button";
import { Circle, Component, Database } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-black">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.04),_transparent)] dark:bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.12),_transparent)] bg-[length:2.5rem_2.5rem] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

      <div className="container relative z-10 flex flex-col items-center justify-center py-20 text-center md:py-32">
        <div className="mb-8 flex items-center space-x-2 rounded-full bg-muted/70 p-1 pr-4">
          <div className="flex -space-x-2">
            <Component className="size-8 rounded-full border-2 border-background bg-blue-500 p-1.5 text-white" />
            <Database className="size-8 rounded-full border-2 border-background bg-green-500 p-1.5 text-white" />
            <Circle className="size-8 rounded-full border-2 border-background bg-red-500 p-1.5 text-white" />
          </div>
          <span className="text-sm font-medium text-foreground/80">50+</span>
          <span className="text-sm text-foreground/60">
            Fastest way to find products
          </span>
        </div>

        <div className="mb-6 max-w-4xl text-5xl font-bold tracking-tighter text-foreground md:text-7xl">
          A fastest way to
          <p className="mb-6 max-w-4xl text-5xl font-bold tracking-tighter text-foreground md:text-7xl bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent">
            find products
          </p>
        </div>
        <p className="mb-10 max-w-2xl text-lg text-foreground/70 md:text-xl">
          Prodfind helps you quickly find the user created web products you
          need, whether it&apos;s a tool, service, or resource.
          <br />
        </p>

        <p className="mb-10 max-w-2xl text-lg md:text-xl">
          Let&apos;s find the best products together!
        </p>

        <Button
          asChild
          size="lg"
          className="h-12 rounded-full px-8 text-lg font-semibold tracking-tight shadow-lg"
        >
          <Link href="/dashboard">Join early access</Link>
        </Button>
      </div>

      <div className="relative z-10 w-full pb-20 [mask-image:linear-gradient(to_top,white,transparent)]">
        <div className="container flex flex-wrap items-center justify-center gap-x-12 gap-y-4 md:justify-between">
          <p className="font-bold text-foreground/80">Prodfind</p>
          <p className="font-bold text-foreground/80">Prodfind</p>
          <p className="font-bold text-foreground/80">Prodfind</p>
          <p className="font-bold text-foreground/80">Prodfind</p>
          <p className="font-bold text-foreground/80">Prodfind</p>
        </div>
      </div>
    </section>
  );
};
