"use client";

import { useEffect, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { YjsContext } from "./yjs-context";

const CURSOR_COLORS = [
    "#fbbf24",
    "#34d399",
    "#60a5fa",
    "#f472b6",
    "#a78bfa",
];

export default function WorkspaceProvider({
    projectId,
    userName,
    children,
}: {
    projectId: string;
    userName: string;
    children: React.ReactNode;
}) {
    const [doc, setDoc] = useState<Y.Doc | null>(null);
    const [provider, setProvider] = useState<WebsocketProvider | null>(null);

    useEffect(() => {
        const ydoc = new Y.Doc();

        let currentProvider: WebsocketProvider | null = null;
        let refreshTimer: ReturnType<typeof setTimeout> | null = null;
        let cancelled = false;

        const color =
            CURSOR_COLORS[
                Math.floor(Math.random() * CURSOR_COLORS.length)
            ];

        async function connect() {
            try {
                const response = await fetch(
                    `/api/ws-token?projectId=${projectId}`
                );

                if (!response.ok) {
                    console.error("Failed to get websocket token");
                    return;
                }

                const { token } = await response.json();

                if (cancelled) return;

                currentProvider?.destroy();

                const wsUrl =
                    process.env.NEXT_PUBLIC_WS_URL ||
                    "ws://localhost:1234";

                const newProvider = new WebsocketProvider(
                    wsUrl,
                    projectId,
                    ydoc,
                    {
                        params: {
                            token,
                        },
                    }
                );

                newProvider.awareness.setLocalStateField("user", {
                    name: userName,
                    color,
                });

                currentProvider = newProvider;

                setDoc(ydoc);
                setProvider(newProvider);

                refreshTimer = setTimeout(() => {
                    connect();
                }, 50 * 60 * 1000);
            } catch (error) {
                console.error("WebSocket connection error:", error);
            }
        }

        connect();

        return () => {
            cancelled = true;

            if (refreshTimer) {
                clearTimeout(refreshTimer);
            }

            currentProvider?.destroy();
            ydoc.destroy();
        };
    }, [projectId, userName]);

    if (!doc || !provider) {
        return (
            <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                Connecting…
            </div>
        );
    }

    return (
        <YjsContext.Provider value={{ doc, provider }}>
            {children}
        </YjsContext.Provider>
    );
}