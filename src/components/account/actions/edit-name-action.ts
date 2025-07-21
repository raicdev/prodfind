"use server";

import { auth } from "@/lib/auth";

export async function editNameAction(name: string) {
    try {
        const { status } = await auth.api.updateUser({
            body: {
                name,
            },
        });

        if (status) {
            return {
                success: true,
            }
        }
    } catch (error: any) {
        console.error(error);
        return {
            success: false,
            error: error.message,
        };
    }
}