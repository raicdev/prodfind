"use client";

import { useEffect, useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldBan, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
}

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Fetch all users once component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await authClient.admin.listUsers({ query: {} });
      if (error) {
        toast.error("Failed to fetch users", { description: error.message });
      } else {
        // The API returns { users, total, ... } in v1.2.x
        const list = Array.isArray(data) ? data : (data as any).users;
        setUsers(list as AdminUser[]);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const refreshUsers = async () => {
    const { data: listData } = await authClient.admin.listUsers({ query: {} });
    const list = Array.isArray(listData) ? listData : (listData as any).users;
    setUsers(list as AdminUser[]);
  };

  const toggleBan = (user: AdminUser) => {
    startTransition(async () => {
      if (user.banned) {
        // Unban
        const { error } = await authClient.admin.unbanUser({ userId: user.id });
        if (error) {
          toast.error("Unban failed", { description: error.message });
        } else {
          toast.success("User unbanned");
          refreshUsers();
        }
      } else {
        const { error } = await authClient.admin.banUser({ userId: user.id });
        if (error) {
          toast.error("Ban failed", { description: error.message });
        } else {
          toast.success("User banned");
          refreshUsers();
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-10">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Manage users from this page.</p>
      </div>

      <div className="border rounded-lg divide-y bg-secondary">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">
                {user.name || "Unnamed"} ({user.email})
              </p>
              <p className="text-sm text-muted-foreground">
                Role: {user.role || "user"}
              </p>
            </div>
            <Button
              variant={user.banned ? "secondary" : "destructive"}
              size="sm"
              onClick={() => toggleBan(user)}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : user.banned ? (
                <>
                  <ShieldCheck className="h-4 w-4 mr-2" /> Unban
                </>
              ) : (
                <>
                  <ShieldBan className="h-4 w-4 mr-2" /> Ban
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 