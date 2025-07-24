"use client";

import { BellIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { trpc } from "@/trpc/client";
import { useAuth } from "@/context/auth-context";

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

  if (!session) return null;

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleNotificationClick = (id: string) => {
    markAsReadMutation.mutate({ id });
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
        {notifications?.map((notification) => (
          <div
            key={notification.id}
            className="hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors"
          >
            <div className="relative flex items-start pe-3">
              <div className="flex-1 space-y-1">
                <button
                  className="text-foreground/80 text-left after:absolute after:inset-0"
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <span className="text-foreground font-medium hover:underline">
                    {notification.actor?.name || "Someone"}
                  </span>{" "}
                  {notification.action}{" "}
                  <span className="text-foreground font-medium hover:underline">
                    {notification.product?.name || "a product"}
                  </span>
                  .
                </button>
                <div className="text-muted-foreground text-xs">
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
              </div>
              {!notification.read && (
                <div className="absolute end-0 self-center">
                  <span className="sr-only">Unread</span>
                  <Dot />
                </div>
              )}
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
