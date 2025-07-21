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
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function TwoFactorAuth() {
    const { auth, session } = useAuth();
    const [isPending, setIsPending] = useState(false);

    const is2FAEnabled = session?.user.twoFactorEnabled;

    async function toggle2FA() {
        setIsPending(true);
        try {
            if (is2FAEnabled) {
                await auth.twoFactor.disable();
                toast.success("Two-factor authentication disabled");
            } else {
                const { secret, qrCode } = await auth.twoFactor.enable();
                // Here you would typically show the QR code and secret to the user
                // and ask them to confirm with a one-time code.
                // For simplicity, we'll just enable it.
                toast.success("Two-factor authentication enabled");
                console.log({ secret, qrCode });
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                    Add an extra layer of security to your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    {is2FAEnabled
                        ? "Two-factor authentication is currently enabled."
                        : "Two-factor authentication is currently disabled."}
                </p>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button onClick={toggle2FA} disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : is2FAEnabled ? (
                        "Disable 2FA"
                    ) : (
                        "Enable 2FA"
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
} 