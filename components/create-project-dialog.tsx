"use client"
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus } from "lucide-react";
import { createProject } from "@/lib/actions/project";

const LANGUAGES = [
    { label: "TypeScript", value: "typescript" },
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C++", value: "cpp" },
    { label: "C#", value: "csharp" },
    { label: "Go", value: "go" },
    { label: "Rust", value: "rust" },
];

export default function CreateProjectDialog() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [language, setLanguage] = useState("typescript");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        const result = await createProject(name, language);
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button className="bg-violet-600 hover:bg-violet-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Project
                    </Button>
                }
            />

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="font-mono text-[#17102b]">
                        New project
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Give your workspace a name and choose a language.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label
                            htmlFor="project-name"
                            className="text-slate-700"
                        >
                            Project name
                        </Label>

                        <Input
                            id="project-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My Awesome App"
                            className="border-violet-200 focus-visible:border-violet-500 focus-visible:ring-violet-500"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="project-language"
                            className="text-slate-700"
                        >
                            Language
                        </Label>

                        <select
                            id="project-language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="h-9 w-full rounded-md border border-violet-200 bg-white px-3 text-sm text-[#17102b] outline-none focus:border-violet-500"
                        >
                            {LANGUAGES.map((lang) => (
                                <option key={lang.value} value={lang.value}>
                                    {lang.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <DialogFooter>
                        <Button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-violet-600 hover:bg-violet-700"
                        >
                            {loading ? "Creating..." : "Create Project"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
