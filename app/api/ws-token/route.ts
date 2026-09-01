import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { SignJWT } from "jose";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
        return NextResponse.json(
            { error: "Project ID required" },
            { status: 400 }
        );
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
        return NextResponse.json(
            { error: "Forbidden" },
            { status: 403 }
        );
    }

    const secret = new TextEncoder().encode(
        process.env.WS_TOKEN_SECRET
    );

    const token = await new SignJWT({
        userId: session.user.id,
        projectId,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secret);

    return NextResponse.json({ token });
}