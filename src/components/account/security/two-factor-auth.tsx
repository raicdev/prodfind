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
import { Loader2, QrCode, Shield, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function TwoFactorAuth() {
  const { auth, session } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [qrCodeUri, setQrCodeUri] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const is2FAEnabled = session?.user.twoFactorEnabled;

  async function enable2FA() {
    if (!password) {
      setShowPasswordInput(true);
      return;
    }

    setIsPending(true);
    try {
      const result = await auth.twoFactor.enable({
        password: password,
      });

      if (result.data) {
        setQrCodeUri(result.data.totpURI);
        try {
          const url = new URL(result.data.totpURI);
          const secretParam = url.searchParams.get("secret");
          setSecret(secretParam || "");
        } catch (error) {
          console.error("Failed to parse TOTP URI:", error);
          setSecret("");
        }
        setBackupCodes(result.data.backupCodes || []);
        setShowSetup(true);
        setShowPasswordInput(false);
        setPassword("");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to enable 2FA");
    } finally {
      setIsPending(false);
    }
  }

  async function verifyAndComplete() {
    if (!verificationCode) {
      toast.error("Please enter a verification code");
      return;
    }

    setIsPending(true);
    try {
      const result = await auth.twoFactor.verifyTotp({
        code: verificationCode,
      });

      if (result.data) {
        toast.success("Two-factor authentication enabled successfully");
        setShowSetup(false);
        setVerificationCode("");
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid verification code");
    } finally {
      setIsPending(false);
    }
  }

  async function disable2FA() {
    if (!password) {
      setShowPasswordInput(true);
      return;
    }

    setIsPending(true);
    try {
      await auth.twoFactor.disable({
        password: password,
      });
      toast.success("Two-factor authentication disabled");
      setPassword("");
      setShowPasswordInput(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to disable 2FA");
    } finally {
      setIsPending(false);
    }
  }

  if (showSetup) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Set up Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Scan the QR code with your authenticator app and enter the
            verification code.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {qrCodeUri && (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUri)}`}
                  alt="2FA QR Code"
                  className="w-48 h-48"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Or enter this code manually:
                </p>
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  {secret}
                </code>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              id="verification-code"
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
            />
          </div>

          {backupCodes.length > 0 && (
            <div className="space-y-2">
              <Label>Backup Codes</Label>
              <p className="text-sm text-muted-foreground">
                Save these backup codes in a secure place. You can use them to
                access your account if you lose your authenticator device.
              </p>
              <div className="bg-muted p-3 rounded-md">
                {backupCodes.map((code, index) => (
                  <div key={index} className="font-mono text-sm">
                    {code}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSetup(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={verifyAndComplete} disabled={isPending}>
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <ShieldCheck className="w-4 h-4 mr-2" />
            )}
            Verify and Enable
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (showPasswordInput) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {is2FAEnabled ? "Disable" : "Enable"} Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Enter your current password to {is2FAEnabled ? "disable" : "enable"}{" "}
            2FA.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setShowPasswordInput(false);
              setPassword("");
            }}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={is2FAEnabled ? disable2FA : enable2FA}
            disabled={isPending || !password}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Shield className="w-4 h-4 mr-2" />
            )}
            Continue
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {is2FAEnabled ? (
            <ShieldCheck className="w-5 h-5 text-green-600" />
          ) : (
            <Shield className="w-5 h-5" />
          )}
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {is2FAEnabled
            ? "Two-factor authentication is currently enabled. Your account is protected with an additional security layer."
            : "Two-factor authentication is currently disabled. Enable it to add an extra layer of security to your account."}
        </p>
      </CardContent>
      <CardFooter className="border-t">
        <Button
          onClick={is2FAEnabled ? disable2FA : enable2FA}
          disabled={isPending}
          variant={is2FAEnabled ? "destructive" : "default"}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : is2FAEnabled ? (
            <Shield className="w-4 h-4 mr-2" />
          ) : (
            <ShieldCheck className="w-4 h-4 mr-2" />
          )}
          {is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
        </Button>
      </CardFooter>
    </Card>
  );
}
