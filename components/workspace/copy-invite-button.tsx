"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

export default function CopyInviteButton({
    inviteCode,
}: {
    inviteCode: string;
}) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        await navigator.clipboard.writeText(inviteCode);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500);
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="border-violet-200 text-violet-700 hover:bg-violet-50"
        >
            {copied ? (
                <Check className="mr-1.5 h-3.5 w-3.5" />
            ) : (
                <Copy className="mr-1.5 h-3.5 w-3.5" />
            )}

            {copied ? "Copied!" : inviteCode}
        </Button>
    );
}