"use server";

import { auth } from "@/lib/auth";
import { toast } from "sonner";

export async function editNameAction(name: string) {
    try {
        const { status } = await auth.api.updateUser({
            body: {
                name,
            },
        });

        if (status) {
            toast.success("Name updated successfully");
        }
    } catch (error: any) {
        console.error(error);
        toast.error("Failed to update name", {
            description: error.message,
        });
    }
}