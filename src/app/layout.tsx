import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { TRPCProvider } from "@/trpc/client";
import { AuthProvider } from "../context/auth-context";
import { BotIdClient } from "botid/client";

// Define the paths that need bot protection.
// These are paths that are routed to by your app.
// These can be:
// - API endpoints (e.g., '/api/sensitive')
// - Pages in your application (e.g., '/checkout')
// - Server actions invoked from a page (e.g., '/dashboard')

const protectedRoutes = [
  {
    path: "/api/*",
    method: "*",
  }
];

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prodfind - Fastest way to find products",
  description: "Find the best products quickly and easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <head>
          <BotIdClient protect={protectedRoutes} />
        </head>
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCProvider>
            <AuthProvider>{children}</AuthProvider>
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
