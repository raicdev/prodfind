import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar/>
        <SidebarInset>
          <div className="flex flex-1 flex-col">
            <main>{children}</main>
            <Footer />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
