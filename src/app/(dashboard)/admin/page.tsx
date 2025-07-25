"use client";

import { useEffect, useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldBan, ShieldCheck, Trash2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface AdminUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
}

interface Product {
  id: string;
  name: string;
  description?: string | null;
  authorId: string;
  createdAt: string | Date;
}

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
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

  // Fetch all products
  const { data: productsData, refetch: refetchProducts } = trpc.getProducts.useQuery({});
  const adminDeleteProductMutation = trpc.adminDeleteProduct.useMutation();
  
  // Fetch appealed products
  const { data: appealedProducts, refetch: refetchAppeals } = trpc.getAppealedProducts.useQuery();
  const adminRestoreProductMutation = trpc.adminRestoreProduct.useMutation();
  const adminRejectAppealMutation = trpc.adminRejectAppeal.useMutation();
  
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedAppealId, setSelectedAppealId] = useState<string | null>(null);

  useEffect(() => {
    if (productsData) {
      setProducts(productsData as unknown as Product[]);
      setProductsLoading(false);
    }
  }, [productsData]);

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

  const deleteProduct = (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}" for Terms of Service violation?`)) {
      return;
    }

    startTransition(async () => {
      try {
        await adminDeleteProductMutation.mutateAsync({ 
          productId: product.id,
          reason: "Violates Terms of Service"
        });
        toast.success("Product deleted and user notified");
        refetchProducts();
      } catch (error) {
        toast.error("Failed to delete product", { 
          description: error instanceof Error ? error.message : "Unknown error" 
        });
      }
    });
  };

  const approveAppeal = (appeal: any) => {
    if (!confirm(`Are you sure you want to approve the appeal for "${appeal.metadata.productName}"?`)) {
      return;
    }

    startTransition(async () => {
      try {
        await adminRestoreProductMutation.mutateAsync({ 
          productId: appeal.notification.target 
        });
        toast.success("Appeal approved and product restored");
        refetchAppeals();
        refetchProducts();
      } catch (error) {
        toast.error("Failed to approve appeal", { 
          description: error instanceof Error ? error.message : "Unknown error" 
        });
      }
    });
  };

  const rejectAppeal = (appeal: any) => {
    startTransition(async () => {
      try {
        await adminRejectAppealMutation.mutateAsync({ 
          notificationId: appeal.notification.id,
          rejectionReason: rejectionReason.trim() || undefined
        });
        toast.success("Appeal rejected");
        refetchAppeals();
        setRejectionReason("");
        setSelectedAppealId(null);
      } catch (error) {
        toast.error("Failed to reject appeal", { 
          description: error instanceof Error ? error.message : "Unknown error" 
        });
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
    <div className="py-4 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Manage users and products from this page.</p>
      </div>

      {/* Users Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
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

      {/* Products Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        {productsLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="border rounded-lg divide-y bg-secondary">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ID: {product.id} • Author: {product.authorId}
                  </p>
                  {product.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteProduct(product)}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete for ToS
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appeals Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Product Appeals</h2>
        {!appealedProducts ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : appealedProducts.length === 0 ? (
          <div className="border rounded-lg p-8 text-center bg-secondary">
            <p className="text-muted-foreground">No appeals to review</p>
          </div>
        ) : (
          <div className="border rounded-lg divide-y bg-secondary">
            {appealedProducts.map((appeal) => (
              <div key={appeal.notification.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium">
                        &quot;{appeal.metadata.productName}&quot; by {appeal.user?.name || appeal.user?.email}
                      </p>
                      {appeal.metadata.appealRejected && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          Rejected
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Original reason: {appeal.metadata.reason}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>User&apos;s appeal:</strong> {appeal.metadata.appealMessage}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Appealed on: {new Date(appeal.metadata.appealDate).toLocaleString()}
                    </p>
                    {appeal.metadata.appealRejected && (
                      <p className="text-xs text-red-600 mt-1">
                        Rejection reason: {appeal.metadata.rejectionReason}
                      </p>
                    )}
                  </div>
                  {!appeal.metadata.appealRejected && appeal.product?.deletedAt && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => approveAppeal(appeal)}
                        disabled={isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setSelectedAppealId(appeal.notification.id)}
                            disabled={isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Appeal</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              You are about to reject the appeal for &quot;{appeal.metadata.productName}&quot;. 
                              Please provide a reason (optional).
                            </p>
                            <Textarea
                              placeholder="Reason for rejecting the appeal..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              className="min-h-[80px]"
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setRejectionReason("");
                                  setSelectedAppealId(null);
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => rejectAppeal(appeal)}
                                disabled={adminRejectAppealMutation.isPending}
                              >
                                {adminRejectAppealMutation.isPending ? "Rejecting..." : "Reject Appeal"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 