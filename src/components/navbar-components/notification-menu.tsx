"use client";

import { BellIcon, AlertTriangle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/trpc/client";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

function Dot({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export default function NotificationMenu() {
  const utils = trpc.useUtils();
  const { session } = useAuth();
  const [appealMessage, setAppealMessage] = useState("");
  const [appealingNotificationId, setAppealingNotificationId] = useState<string | null>(null);
  
  const { data: notifications, isLoading } = trpc.notifications.get.useQuery(
    undefined,
    { enabled: !!session }
  );

  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.get.invalidate();
    },
  });

  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.get.invalidate();
    },
  });

  const appealMutation = trpc.notifications.appealProductRemoval.useMutation({
    onSuccess: () => {
      toast.success("Appeal submitted successfully");
      utils.notifications.get.invalidate();
      setAppealMessage("");
      setAppealingNotificationId(null);
    },
    onError: (error) => {
      toast.error("Failed to submit appeal", { description: error.message });
    },
  });

  if (!session) return null;

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleNotificationClick = (id: string) => {
    markAsReadMutation.mutate({ id });
  };

  const handleAppealSubmit = () => {
    if (!appealingNotificationId || !appealMessage.trim()) return;
    
    appealMutation.mutate({
      notificationId: appealingNotificationId,
      appealMessage: appealMessage.trim(),
    });
  };

  const getNotificationMessage = (notification: any) => {
    if (notification.action === "product_removed") {
      const metadata = notification.metadata ? JSON.parse(notification.metadata) : {};
      return (
        <>
          Your product{" "}
          <span className="text-foreground font-medium">
            &quot;{metadata.productName || "Unknown Product"}&quot;
          </span>{" "}
          was removed because it violates Terms of Service.
        </>
      );
    }
    
    // Default format for other notifications
    return (
      <>
        <span className="text-foreground font-medium hover:underline">
          {notification.actor?.name || "Someone"}
        </span>{" "}
        {notification.action}{" "}
        <span className="text-foreground font-medium hover:underline">
          {notification.product?.name || "a product"}
        </span>
        .
      </>
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground relative size-8 rounded-full shadow-none"
          aria-label="Open notifications"
        >
          <BellIcon size={16} aria-hidden="true" />
          {unreadCount > 0 && (
            <div
              aria-hidden="true"
              className="bg-primary absolute top-0.5 right-0.5 size-1 rounded-full"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-1">
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="text-sm font-semibold">Notifications</div>
          {unreadCount > 0 && (
            <button
              className="text-xs font-medium hover:underline"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
          )}
        </div>
        <div
          role="separator"
          aria-orientation="horizontal"
          className="bg-border -mx-1 my-1 h-px"
        ></div>
        {isLoading && <div className="p-4 text-sm">Loading...</div>}
        {!isLoading && notifications?.length === 0 && (
          <div className="p-4 text-sm">No notifications</div>
        )}
        {notifications?.map((notification) => {
          const metadata = notification.metadata ? JSON.parse(notification.metadata) : {};
          const isProductRemoval = notification.action === "product_removed";
          const canAppeal = isProductRemoval && metadata.canAppeal && !metadata.appealed;

          return (
            <div
              key={notification.id}
              className="rounded-md px-3 py-2 text-sm transition-colors"
            >
              <div className="relative flex items-start pe-3">
                <div className="flex-1 space-y-1">
                  <div 
                    className={`text-foreground/80 text-left ${isProductRemoval ? 'cursor-default' : 'cursor-pointer hover:bg-accent'}`}
                    onClick={() => !isProductRemoval && handleNotificationClick(notification.id)}
                  >
                    {isProductRemoval && (
                      <AlertTriangle className="inline w-4 h-4 mr-1 text-orange-500" />
                    )}
                    {getNotificationMessage(notification)}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {new Date(notification.createdAt).toLocaleString()}
                    {metadata.appealed && !metadata.appealRejected && (
                      <span className="ml-2 text-blue-600 font-medium">• Appeal submitted</span>
                    )}
                    {metadata.appealRejected && (
                      <span className="ml-2 text-red-600 font-medium">• Appeal rejected</span>
                    )}
                  </div>
                  {metadata.appealRejected && metadata.rejectionReason && (
                    <div className="text-xs text-red-600 mt-1">
                      Rejection reason: {metadata.rejectionReason}
                    </div>
                  )}
                  {canAppeal && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 h-7"
                          onClick={() => setAppealingNotificationId(notification.id)}
                        >
                          Appeal Removal
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Appeal Product Removal</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Your product &quot;{metadata.productName}&quot; was removed for violating our Terms of Service. 
                            If you believe this was done in error, please explain why below.
                          </p>
                          <Textarea
                            placeholder="Explain why you think your product was removed incorrectly..."
                            value={appealMessage}
                            onChange={(e) => setAppealMessage(e.target.value)}
                            className="min-h-[100px]"
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setAppealMessage("");
                                setAppealingNotificationId(null);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleAppealSubmit}
                              disabled={!appealMessage.trim() || appealMutation.isPending}
                            >
                              {appealMutation.isPending ? "Submitting..." : "Submit Appeal"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                {!notification.read && (
                  <div className="absolute end-0 self-center">
                    <span className="sr-only">Unread</span>
                    <Dot />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
