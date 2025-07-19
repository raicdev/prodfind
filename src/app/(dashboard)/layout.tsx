import Header from "@/components/dashboard/header";
import TabsNav from "@/components/dashboard/tabs-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <TabsNav />
      <div className="text-center py-2 bg-gradient-to-r from-primary to-primary/50">
        <p className="font-bold">Welcome to Prodfind!</p>
      </div>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </>
  );
}
