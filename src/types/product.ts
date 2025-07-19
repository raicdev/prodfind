import { z } from "zod";

export const ProductLinkSchema = z.object({
    id: z.string(),
    url: z.url(),
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
});

export const ProductImageSchema = z.object({
    id: z.string(),
    url: z.url(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export const ProductSchema = z.object({
    id: z.uuid(),
    authorId: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    images: z.array(ProductImageSchema),
    icon: z.string().optional(),
    category: z.array(z.string()),
    links: z.array(ProductLinkSchema),
});

export const ProductsSchema = z.array(ProductSchema);

export type Product = z.infer<typeof ProductSchema>;
export type ProductLink = z.infer<typeof ProductLinkSchema>;
export type Products = z.infer<typeof ProductsSchema>;