import AuthGuard from "@/components/auth-guard";
import Header from "@/components/dashboard/header";
import TabsNav from "@/components/dashboard/tabs-nav";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  return (
    <>
      <Header />
      <TabsNav session={session} />
      <div className="text-center py-2 bg-gradient-to-r from-primary to-primary/50">
        <p className="font-semibold">Welcome to Prodfind!</p>
      </div>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 p-6 w-full max-w-7xl mx-auto">
          <AuthGuard>{children}</AuthGuard>
        </main>
      </div>
    </>
  );
}
