
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChangePassword } from "./_components/change-password";

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
    </div>
  );
} 