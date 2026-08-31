"use client"
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus } from "lucide-react";
import { createProject } from "@/lib/actions/project";

export default function CreateProjectDialog() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        const result = await createProject(name);
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={
                <Button className="bg-violet-600 hover:bg-violet-700">
                    <Plus className="mr-2 h-4 w-4" /> Create New Project
                </Button>
            } />
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="font-mono text-[#17102b]">New project</DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Give your workspace a name — you can invite others once it&apos;s created.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (<div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>)}
                    <div className="space-y-2">
                        <Label htmlFor="project-name" className="text-slate-700">Project name</Label>
                        <Input
                            id="project-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My Awesome App"
                            className="border-violet-200 focus-visible:border-violet-500 focus-visible:ring-violet-500"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button disabled={loading} type="submit" className="w-full bg-violet-600 hover:bg-violet-700">
                            {loading ? "Creating..." : "Create Project"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
