"use client"
import { createContext, useContext } from "react";
import type * as Y from "yjs";
import type { WebsocketProvider } from "y-websocket";

type YjsContextValue = {
    doc: Y.Doc;
    provider: WebsocketProvider;
} | null;

export const YjsContext = createContext<YjsContextValue>(null);

export function useYjs() {
    const ctx = useContext(YjsContext);
    if (!ctx) throw new Error("useYjs must be used inside <WorkspaceProvider>");
    return ctx;
}
