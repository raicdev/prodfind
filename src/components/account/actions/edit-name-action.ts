"use server";

import { auth } from "@/lib/auth";
import { headers as getHeaders } from "next/headers";

export async function editNameAction(name: string) {
    try {
        const headers = await getHeaders();

        const { status } = await auth.api.updateUser({
            headers,
            body: {
                name,
            },
        });

        if (status) {
            return {
                success: true,
            }
        }
    } catch (error: unknown) {
        console.error(error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}