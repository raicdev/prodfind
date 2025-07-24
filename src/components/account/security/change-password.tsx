"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ChangePassword() {
  const { auth } = useAuth();
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPending, setIsPending] = useState(false);
  const [hasPasswordProvider, setHasPasswordProvider] = useState(false);
  const [isCheckingProvider, setIsCheckingProvider] = useState(true);

  useEffect(() => {
    async function checkProvider() {
      try {
        const result = await auth.listAccounts();
        if (result && "data" in result && Array.isArray(result.data)) {
            const hasProvider = result.data.some(
              (p) => p.provider === "credential"
            );
            setHasPasswordProvider(hasProvider);
        }
      } catch (error) {
        console.error("Failed to check for password provider:", error);
      } finally {
        setIsCheckingProvider(false);
      }
    }
    checkProvider();
  }, [auth]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsPending(true);
    try {
      await auth.changePassword({
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
        revokeOtherSessions: true,
      });
      toast.success("Password updated successfully");
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  }

  if (isCheckingProvider) {
    return (
      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!hasPasswordProvider) return null;

  return (
    <form onSubmit={handleSubmit}>
      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password here. After changing your password, you will be
            logged out from all other sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={password.currentPassword}
              onChange={(e) =>
                setPassword({ ...password, currentPassword: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={password.newPassword}
              onChange={(e) =>
                setPassword({ ...password, newPassword: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={password.confirmPassword}
              onChange={(e) =>
                setPassword({ ...password, confirmPassword: e.target.value })
              }
            />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Update Password"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
} 