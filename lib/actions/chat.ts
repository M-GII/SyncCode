"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getMessages(projectId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return { error: "You must be signed in." };
    }

    const membership = await prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId,
                userId: session.user.id,
            },
        },
    });

    if (!membership) {
        return { error: "You're not a member of this project." };
    }

    const messages = await prisma.message.findMany({
        where: { projectId },
        include: {
            user: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: "asc",
        },
        take: 100,
    });

    return { messages };
}

export async function sendMessage(projectId: string, content: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return { error: "You must be signed in." };
    }

    const trimmed = content.trim();

    if (!trimmed) {
        return { error: "Message can't be empty." };
    }

    if (trimmed.length > 1000) {
        return { error: "Message is too long." };
    }

    const membership = await prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId,
                userId: session.user.id,
            },
        },
    });

    if (!membership) {
        return { error: "You're not a member of this project." };
    }

    const message = await prisma.message.create({
        data: {
            projectId,
            userId: session.user.id,
            content: trimmed,
        },
        include: {
            user: {
                select: {
                    name: true,
                },
            },
        },
    });

    revalidatePath(`/project/${projectId}`);

    return { message };
}