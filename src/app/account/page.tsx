import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { headers as getHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { EditNameDialog } from "./components/EditNameDialog";
import { UpdateEmailDialog } from "./components/UpdateEmailDialog";
import { SignInMethods } from "./components/SignInMethods";
import { Metadata } from "next";
import { UpdateAvatarDialog } from "./components/UpdateAvatarDialog";

export const metadata: Metadata = {
  title: "Account - Prodfind",
  description: "Manage your account information.",
};

export default async function AccountPage() {
  const headers = await getHeaders();
  const session = await auth.api.getSession({ headers });

  if (!session) {
    redirect("/login");
  }

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, session.user.id),
  });

  if (!user) {
    redirect("/login");
  }

  const accounts = await db.query.accounts.findMany({
    where: (accounts, { eq }) => eq(accounts.userId, session.user.id),
  });

  const userWithAccounts = {
    ...user,
    accounts,
  };

  return (
    <>
      <div className="flex justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Your account</h2>
          <p className="text-muted-foreground">Manage your account information.</p>
        </div>
        <div className="flex flex-col items-center gap-y-2">
          <UpdateAvatarDialog>
            <Avatar className="h-16 w-16 cursor-pointer">
              <AvatarImage
                src={user.image ?? ""}
                alt={session.user.name ?? ""}
              />
              <AvatarFallback>
                {session.user.name?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </UpdateAvatarDialog>
        </div>
      </div>
      <Card className="mt-6 bg-secondary">
        <CardContent className="px-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Full name
                </p>
                <p>{user.name}</p>
              </div>
              <EditNameDialog
                currentName={user.name}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{user.email}</p>
              </div>
              <UpdateEmailDialog />
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Account created
              </p>
              <p>
                {new Date(user.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <SignInMethods user={userWithAccounts} />
    </>
  );
}
