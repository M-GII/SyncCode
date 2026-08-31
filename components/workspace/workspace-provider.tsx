"use client"
import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { YjsContext } from "./yjs-context";

const CURSOR_COLORS = ["#fbbf24", "#34d399", "#60a5fa", "#f472b6", "#a78bfa"];

export default function WorkspaceProvider({
    projectId,
    userName,
    children,
}: {
    projectId: string;
    userName: string;
    children: React.ReactNode;
}) {
    const [ready, setReady] = useState(false);
    const docRef = useRef<Y.Doc | null>(null);
    const providerRef = useRef<WebsocketProvider | null>(null);

    useEffect(() => {
        const doc = new Y.Doc();
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:1234";

        // One provider for the whole page — editor and members panel both
        // read from this instead of opening separate connections.
        const provider = new WebsocketProvider(wsUrl, projectId, doc);

        provider.awareness.setLocalStateField("user", {
            name: userName,
            color: CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)],
        });

        docRef.current = doc;
        providerRef.current = provider;
        setReady(true);

        return () => {
            provider.destroy();
            doc.destroy();
        };
    }, [projectId, userName]);

    if (!ready || !docRef.current || !providerRef.current) {
        return (
            <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                Connecting…
            </div>
        );
    }

    return (
        <YjsContext.Provider value={{ doc: docRef.current, provider: providerRef.current }}>
            {children}
        </YjsContext.Provider>
    );
}
