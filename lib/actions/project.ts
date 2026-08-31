"use server"

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { generateInviteCode } from "../invite-code";

export async function createProject(name: string, language: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return { error: "You must be signed in to create a project." };
    }

    const trimmed = name.trim();

    if (!trimmed) {
        return { error: "Project name is required." };
    }

    if (!language) {
        return { error: "Project language is required." };
    }

    let project = null;

    for (let attempt = 0; attempt < 5; attempt++) {
        const inviteCode = generateInviteCode();

        try {
            project = await prisma.project.create({
                data: {
                    name: trimmed,
                    language,
                    inviteCode,
                    ownerId: session.user.id,
                    members: {
                        create: {
                            userId: session.user.id,
                            role: "owner",
                        },
                    },
                },
            });

            break;
        } catch (err: any) {
            if (err?.code === "P2002") continue;

            return {
                error: "Failed to create project. Please try again.",
            };
        }
    }

    if (!project) {
        return {
            error: "Could not generate a unique invite code. Please try again.",
        };
    }

    redirect(`/project/${project.id}`);
}

export async function joinProject(inviteCode: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
        return { error: "You must be signed in to join a project." };
    }

    const code = inviteCode.trim().toUpperCase();
    if (!code) {
        return { error: "Invite code is required." };
    }

    const project = await prisma.project.findUnique({ where: { inviteCode: code } });
    if (!project) {
        return { error: "That invite code doesn't match any project." };
    }

    const existingMembership = await prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId: project.id,
                userId: session.user.id,
            },
        },
    });

    if (!existingMembership) {
        await prisma.projectMember.create({
            data: {
                projectId: project.id,
                userId: session.user.id,
                role: "editor",
            },
        });
    }

    redirect(`/project/${project.id}`);
}