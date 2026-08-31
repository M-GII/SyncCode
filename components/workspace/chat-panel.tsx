"use client";

import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendMessage } from "@/lib/actions/chat";
import { Send } from "lucide-react";
import { useYjs } from "./yjs-context";

type ChatMessage = {
    id: string;
    content: string;
    createdAt: Date;
    userId: string;
    user: { name: string };
};

type YjsChatMessage = Omit<ChatMessage, "createdAt"> & {
    createdAt: string;
};

export default function ChatPanel({
    projectId,
    initialMessages,
    currentUserId,
}: {
    projectId: string;
    initialMessages: ChatMessage[];
    currentUserId: string;
}) {
    const { doc } = useYjs();

    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [text, setText] = useState("");
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    const yMessages = doc.getArray<YjsChatMessage>("chat-messages");

    useEffect(() => {
        const updateMessages = () => {
            const liveMessages: ChatMessage[] = yMessages
                .toArray()
                .map((message) => ({
                    ...message,
                    createdAt: new Date(message.createdAt),
                }));

            const combined = [...initialMessages, ...liveMessages];

            // Remove duplicates by database message ID
            const uniqueMessages = Array.from(
                new Map(
                    combined.map((message) => [message.id, message])
                ).values()
            );

            uniqueMessages.sort(
                (a, b) =>
                    a.createdAt.getTime() - b.createdAt.getTime()
            );

            setMessages(uniqueMessages);
        };

        updateMessages();

        yMessages.observe(updateMessages);

        return () => {
            yMessages.unobserve(updateMessages);
        };
    }, [yMessages, initialMessages]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const content = text.trim();
        if (!content) return;

        setError("");
        setText("");

        startTransition(async () => {
            const result = await sendMessage(projectId, content);

            if (result.error) {
                setError(result.error);
                setText(content);
                return;
            }

            if (result.message) {
                yMessages.push([
                    {
                        ...result.message,
                        createdAt:
                            result.message.createdAt.toISOString(),
                    },
                ]);
            }
        });
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
                {messages.length === 0 && (
                    <p className="text-sm text-slate-400">
                        No messages yet — say hi.
                    </p>
                )}

                {messages.map((m) => (
                    <p key={m.id} className="text-sm">
                        <span className="font-medium text-violet-700">
                            {m.userId === currentUserId
                                ? "You"
                                : m.user.name}
                            :
                        </span>{" "}
                        <span className="text-[#17102b]">
                            {m.content}
                        </span>
                    </p>
                ))}
            </div>

            {error && (
                <p className="mt-1 text-xs text-red-500">
                    {error}
                </p>
            )}

            <form
                onSubmit={handleSubmit}
                className="mt-2 flex gap-2"
            >
                <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Message the room..."
                    className="h-8 border-violet-200 text-sm focus-visible:border-violet-500 focus-visible:ring-violet-500"
                    maxLength={1000}
                />

                <Button
                    type="submit"
                    size="sm"
                    disabled={isPending || !text.trim()}
                    className="h-8 bg-violet-600 px-3 hover:bg-violet-700"
                >
                    <Send className="h-3.5 w-3.5" />
                </Button>
            </form>
        </div>
    );
}