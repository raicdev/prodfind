import { z } from 'zod';

/**
 * Safe user schema that only exposes public fields
 * This should be used whenever user data is returned to clients
 */
export const SafeUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable(),
  createdAt: z.coerce.date(),
});

// Type for serialized safe user data (as returned by tRPC)
export type SafeUser = {
  id: string;
  name: string;
  image: string | null;
  createdAt: string; // serialized as string over network
};

// Note: SAFE_USER_COLUMNS should be imported from the actual schema file
// where the table is defined to get the proper column references