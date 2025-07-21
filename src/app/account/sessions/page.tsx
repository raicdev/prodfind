"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";
import { Laptop, Loader2, Smartphone, Trash2 } from "lucide-react";
import { UAParser } from "ua-parser-js";

export default function SessionsPage() {
  const { data: currentSession, isPending: isCurrentSessionPending } =
    authClient.useSession();

  const {
    data: sessions,
    refetch,
    isPending,
  } = trpc.session.getSessions.useQuery();
  const { mutate: endSession, isPending: isEndingSession } =
    trpc.session.endSession.useMutation({
      onSuccess: () => {
        refetch();
      },
    });

  const getDeviceIcon = (userAgent: string | null) => {
    if (!userAgent) return <Laptop className="w-6 h-6" />;
    if (/mobile/i.test(userAgent)) {
      return <Smartphone className="w-6 h-6" />;
    }
    return <Laptop className="w-6 h-6" />;
  };

  const getDeviceInfo = (userAgent: string | null) => {
    if (!userAgent) return "Unknown Device";
    const parser = UAParser(userAgent);
    const browser = parser.browser;
    const os = parser.os;
    return `${browser.name || "Unknown Browser"} on ${os.name || "Unknown OS"}`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h2 className="text-3xl font-semibold tracking-tight">
          Active Sessions
        </h2>
        <p className="text-muted-foreground">Manage your active sessions.</p>
      </div>
      <div className="space-y-4">
        {isPending || isCurrentSessionPending ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          sessions?.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-secondary"
            >
              <div className="flex items-center gap-4">
                {getDeviceIcon(session.userAgent)}{" "}
                <div>
                  <p className="font-semibold flex items-center gap-1">
                    {getDeviceInfo(session.userAgent)}
                    {session.id === currentSession?.session.id && (
                      <Badge variant="outline">Current</Badge>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {session.ipAddress ?? "Unknown IP"} - Last seen:{" "}
                    {new Date(session.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => endSession({ sessionId: session.id })}
                disabled={
                  isEndingSession || session.id === currentSession?.session.id
                }
              >
                {isEndingSession ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
