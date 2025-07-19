"use client";

import {
  ArrowRight,
  ArrowUpRight,
  BadgeCent,
  Bot,
  Camera,
  CircleDollarSign,
  Cog,
  Play,
  ShoppingBag,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="py-24 lg:py-0">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Badge variant="outline">
              Prodfind is here!
              <ArrowUpRight className="ml-2 size-4" />
            </Badge>
            <h1 className="my-6 text-pretty text-5xl font-bold lg:text-7xl bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent">
              A fastest way to find products
            </h1>
            <p className="text-muted-foreground mb-8 max-w-2xl text-lg lg:text-2xl">
              Prodfind helps you quickly find the user created web products you
              need, whether it&apos;s a tool, service, or resource.
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/explore">Get Started</Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/login">
                  Login
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-16 pb-8 pt-12 md:py-32 overflow-hidden mx-auto">
            <div className="gap-x-22 odd:-translate-x-22 flex">
              <div className="size-22 border-background bg-background rounded-xl border shadow-xl flex-shrink-0">
                <div className="bg-muted/20 h-full w-full p-4 rounded-xl">
                  <Sparkles className="w-full h-full" />
                </div>
              </div>
              <div className="size-22 border-background bg-background rounded-xl border shadow-xl flex-shrink-0">
                <div className="bg-muted/20 h-full w-full p-4 rounded-xl">
                  <Bot className="w-full h-full" />
                </div>
              </div>
              <div className="size-22 border-background bg-background rounded-xl border shadow-xl flex-shrink-0">
                <div className="bg-muted/20 h-full w-full p-4 rounded-xl">
                  <CircleDollarSign className="w-full h-full" />
                </div>
              </div>
            </div>
            <div className="gap-x-22 odd:-translate-x-22 flex">
              <div className="size-22 border-background bg-background rounded-xl border shadow-xl flex-shrink-0">
                <div className="bg-muted/20 h-full w-full p-4 rounded-xl">
                  <BadgeCent className="w-full h-full" />
                </div>
              </div>
              <div className="size-22 border-background bg-background rounded-xl border shadow-xl flex-shrink-0">
                <div className="bg-muted/20 h-full w-full p-4 rounded-xl">
                  <ShoppingBag className="w-full h-full" />
                </div>
              </div>
              <div className="size-22 border-background bg-background rounded-xl border shadow-xl flex-shrink-0">
                <div className="bg-muted/20 h-full w-full p-4 rounded-xl">
                  <UploadCloud className="w-full h-full" />
                </div>
              </div>
            </div>
            <div className="gap-x-22 odd:-translate-x-22 flex">
              <div className="size-22 border-background bg-background rounded-xl border shadow-xl flex-shrink-0">
                <div className="bg-muted/20 h-full w-full p-4 rounded-xl">
                  <Cog className="w-full h-full" />
                </div>
              </div>
              <div className="size-22 border-background bg-background rounded-xl border shadow-xl flex-shrink-0">
                <div className="bg-muted/20 h-full w-full p-4 rounded-xl">
                  <Play className="w-full h-full" />
                </div>
              </div>
              <div className="size-22 border-background bg-background rounded-xl border shadow-xl flex-shrink-0">
                <div className="bg-muted/20 h-full w-full p-4 rounded-xl">
                  <Camera className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
