"use server";

import { auth } from "@/lib/auth";
import { headers as getHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { default as AccountMainLayout } from "@/components/account/general/account-layout";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headers = await getHeaders();
  const session = await auth.api.getSession({ headers });

  if (!session) {
    redirect("/login");
  }

  return <AccountMainLayout session={session}>{children}</AccountMainLayout>;
}
