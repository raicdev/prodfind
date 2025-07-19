import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="px-8">{children}</main>
      <Footer />
    </>
  );
}
