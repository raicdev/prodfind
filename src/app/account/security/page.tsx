import { ChangePassword } from "@/components/account/security/change-password";
import { TwoFactorAuth } from "@/components/account/security/two-factor-auth";

export default function SecurityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Security</h2>
        <p className="text-muted-foreground">
          Manage your account security settings.
        </p>
      </div>
      <ChangePassword />
      <TwoFactorAuth />
    </div>
  );
} 