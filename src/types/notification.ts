// Notification fields as serialized by tRPC (dates become strings)
export type NotificationWithRelations = {
  id: string;
  userId: string;
  target: string;
  action: string;
  createdAt: string;
  read: boolean;
  actorId: string | null;
  metadata: string | null;
  actor: {
    id: string;
    name: string;
    image: string | null;
    createdAt: string;
  } | null;
  product: {
    id: string;
    authorId: string;
    name: string;
    description: string | null;
    shortDescription: string | null;
    price: string;
    images?: unknown;
    icon: string | null;
    links?: unknown;
    category: unknown[] | null;
    license: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    deletedBy: string | null;
    deletionReason: string | null;
  } | null;
};

// For backwards compatibility
export type Notification = NotificationWithRelations;