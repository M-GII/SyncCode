import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CreateProjectDialog from "@/components/create-project-dialog";
import JoinProjectDialog from "@/components/join-project-dialog";
import ProjectCard from "@/components/project-card";

export default async function DashboardPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/sign-in");
    const memberships = await prisma.projectMember.findMany({
        where: { userId: session.user.id },
        include: { project: true },
        orderBy: { project: { updatedAt: "desc" } },
    });

    return (
        <div className="min-h-screen bg-white">
            <main className="container mx-auto px-4 py-10">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-mono text-2xl font-bold text-[#17102b]">Your Projects</h1>
                        <p className="text-slate-500">Everything you own or have joined.</p>
                    </div>
                    <div className="flex gap-3">
                        <JoinProjectDialog />
                        <CreateProjectDialog />
                    </div>
                </div>

                {memberships.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-violet-200 bg-violet-50/40 py-16 text-center">
                        <p className="text-slate-500">
                            No projects yet — create one or join with an invite code.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {memberships.map((m) => (
                            <ProjectCard
                                key={m.project.id}
                                id={m.project.id}
                                name={m.project.name}
                                role={m.role}
                                updatedAt={m.project.updatedAt}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
