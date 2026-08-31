"use client";

import { useEffect, useRef, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useYjs } from "./yjs-context";

export default function CodeEditor({language}:{language:string}) {
    const { doc, provider } = useYjs();

    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const updatingFromYjs = useRef(false);

    const [status, setStatus] = useState<
        "connecting" | "connected" | "disconnected"
    >(provider.wsconnected ? "connected" : "connecting");

    useEffect(() => {
        const handleStatus = ({ status }: { status: string }) => {
            setStatus(
                status === "connected"
                    ? "connected"
                    : "disconnected"
            );
        };

        provider.on("status", handleStatus);

        return () => {
            provider.off("status", handleStatus);
        };
    }, [provider]);

    const handleMount: OnMount = (editorInstance) => {
        editorRef.current = editorInstance;

        const model = editorInstance.getModel();
        if (!model) return;

        const yText = doc.getText("monaco");

        if (yText.length > 0) {
            model.setValue(yText.toString());
        } else if (model.getValue()) {
            yText.insert(0, model.getValue());
        }

        const disposable = model.onDidChangeContent(() => {
            if (updatingFromYjs.current) return;

            const value = model.getValue();

            doc.transact(() => {
                yText.delete(0, yText.length);
                yText.insert(0, value);
            });
        });

        const handleYjsChange = () => {
            const value = yText.toString();

            if (model.getValue() === value) return;

            updatingFromYjs.current = true;
            model.setValue(value);
            updatingFromYjs.current = false;
        };

        yText.observe(handleYjsChange);

        editorInstance.onDidDispose(() => {
            disposable.dispose();
            yText.unobserve(handleYjsChange);
        });
    };

    return (
        <div className="relative h-full w-full">
            <div
                className="absolute right-3 top-3 z-10 rounded-full px-2.5 py-1 text-xs font-medium"
                style={{
                    backgroundColor:
                        status === "connected"
                            ? "#d1fae5"
                            : "#fee2e2",
                    color:
                        status === "connected"
                            ? "#059669"
                            : "#dc2626",
                }}
            >
                {status === "connected"
                    ? "Synced"
                    : "Reconnecting..."}
            </div>

            <Editor
                height="100%"
                theme="vs-dark"
                language={language}
                defaultValue=""
                onMount={handleMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    automaticLayout: true,
                }}
            />
        </div>
    );
}