import { z } from "zod";

export const ProductLinkSchema = z.object({
    id: z.uuid(),
    url: z.url(),
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
});

export const ProductImageSchema = z.object({
    id: z.uuid(),
    url: z.url(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export const ProductSchema = z.object({
    id: z.uuid(),
    authorId: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    price: z.string(),
    images: z.array(ProductImageSchema).nullable(),
    icon: z.string().nullable(),
    links: z.array(ProductLinkSchema).nullable(),
    category: z.array(z.string()).nullable(),
    license: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    recommendationCount: z.number().optional(),
});

export const ProductWithAuthorSchema = ProductSchema.extend({
    author: z.object({
        id: z.uuid(),
        name: z.string(),
        email: z.string(),
        emailVerified: z.boolean(),
        image: z.string().optional(),
        createdAt: z.date(),
        updatedAt: z.date(),
    }),
});

export const ProductsSchema = z.array(ProductSchema);

export type Product = z.infer<typeof ProductSchema>;
export type ProductLink = z.infer<typeof ProductLinkSchema>;
export type Products = z.infer<typeof ProductsSchema>;
export type ProductWithAuthor = z.infer<typeof ProductWithAuthorSchema>;