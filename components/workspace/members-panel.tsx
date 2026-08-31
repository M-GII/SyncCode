"use client";

import { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { useYjs } from "./yjs-context";

type AwareUser = {
    clientId: number;
    name: string;
    color: string;
};

export default function MembersPanel() {
    const { provider } = useYjs();
    const [users, setUsers] = useState<AwareUser[]>([]);

    useEffect(() => {
        function updateUsers() {
            const states = provider.awareness.getStates();
            const list: AwareUser[] = [];

            states.forEach((state, clientId) => {
                if (state.user) {
                    list.push({
                        clientId,
                        name: state.user.name,
                        color: state.user.color,
                    });
                }
            });

            setUsers(list);
        }

        updateUsers();
        provider.awareness.on("change", updateUsers);

        return () => {
            provider.awareness.off("change", updateUsers);
        };
    }, [provider]);

    return (
    <div className="flex h-full flex-col p-3">
        <span className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Members ({users.length})
        </span>

        <div className="flex flex-col gap-2">
            {users.length === 0 && (
                <span className="text-sm text-slate-400">
                    Connecting…
                </span>
            )}

            {users.map((u) => (
                <div
                    key={u.clientId}
                    className="flex items-center gap-2 text-sm"
                >
                    <Circle
                        className="h-2 w-2 shrink-0"
                        style={{
                            fill: u.color,
                            color: u.color,
                        }}
                    />

                    <span className="truncate text-[#17102b]">
                        {u.name}
                    </span>
                </div>
            ))}
        </div>
    </div>
);
}