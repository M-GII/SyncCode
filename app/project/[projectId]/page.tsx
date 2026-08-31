import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import WorkspaceProvider from "@/components/workspace/workspace-provider";
import CodeEditor from "@/components/workspace/code-editor";
import MembersPanel from "@/components/workspace/members-panel";
import ChatPanel from "@/components/workspace/chat-panel";
import { getMessages } from "@/lib/actions/chat";
import CopyInviteButton from "@/components/workspace/copy-invite-button";

export default async function ProjectPage({params,}: {params: Promise<{ projectId: string }>;}) {
    const { projectId } = await params;
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) redirect("/sign-in");

    const project = await prisma.project.findUnique({
        where: { id: projectId },
    });

    if (!project) notFound();

    const membership = await prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId,
                userId: session.user.id,
            },
        },
    });

    if (!membership) redirect("/dashboard");

    const messagesResult = await getMessages(projectId);
    const initialMessages = messagesResult.messages ?? [];

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col bg-slate-50">
            <div className="container mx-auto flex h-full flex-col px-4 py-4">
                {/* Project header */}
                <header className="mb-3 flex items-center justify-between rounded-lg border border-violet-100 bg-white px-4 py-3 shadow-sm">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Project
                        </p>

                        <h1 className="font-mono text-base font-bold text-[#17102b]">
                            {project.name}
                        </h1>
                    </div>
                   <CopyInviteButton inviteCode={project.inviteCode} />
                </header>

                <WorkspaceProvider
                    projectId={project.id}
                    userName={session.user.name}
                >
                    <div className="flex min-h-0 flex-1 overflow-hidden rounded-lg border border-violet-100 bg-white">
                        <aside className="h-full w-44 shrink-0 border-r border-violet-100 bg-white">
                            <MembersPanel />
                        </aside>
                        <div className="min-w-0 flex-1 bg-[#1e1e1e]">
                            <CodeEditor language={project.language} />
                        </div>
                        <aside className="flex h-full w-72 shrink-0 flex-col border-l border-violet-100 bg-white p-3">
                            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Chat
                            </h2>
                            <ChatPanel projectId={project.id} initialMessages={initialMessages} currentUserId={session.user.id}/>
                        </aside>
                    </div>
                </WorkspaceProvider>
            </div>
        </div>
    );
}
