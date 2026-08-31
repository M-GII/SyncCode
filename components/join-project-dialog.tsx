"use client"
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { LogIn } from "lucide-react";
import { joinProject } from "@/lib/actions/project";

export default function JoinProjectDialog() {
    const [open, setOpen] = useState(false);
    const [inviteCode, setInviteCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        const result = await joinProject(inviteCode);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={
                <Button variant="outline" className="border-violet-200 text-violet-700 hover:bg-violet-50">
                    <LogIn className="mr-2 h-4 w-4" /> Join Project
                </Button>
            } />
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="font-mono text-[#17102b]">Join a project</DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Enter the invite code someone shared with you.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (<div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>)}
                    <div className="space-y-2">
                        <Label htmlFor="invite-code" className="text-slate-700">Invite code</Label>
                        <Input
                            id="invite-code"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            placeholder="ABCD1234"
                            className="border-violet-200 font-mono uppercase tracking-wider focus-visible:border-violet-500 focus-visible:ring-violet-500"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button disabled={loading} type="submit" className="w-full bg-violet-600 hover:bg-violet-700">
                            {loading ? "Joining..." : "Join Project"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
