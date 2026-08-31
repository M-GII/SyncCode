import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ projectId: string }>;
}) {
    const { projectId } = await params;

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { name: true, inviteCode: true },
    });

    if (!project) notFound();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-white">
            <h1 className="font-mono text-xl font-bold text-[#17102b]">{project.name}</h1>
            <p className="text-sm text-slate-500">
                Invite code:{" "}
                <span className="rounded bg-violet-50 px-2 py-1 font-mono font-semibold text-violet-700">
                    {project.inviteCode}
                </span>
            </p>
        </div>
    );
}