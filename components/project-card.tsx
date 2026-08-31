import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Crown, Pencil } from "lucide-react";

function timeAgo(date: Date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const units: [number, string][] = [
        [60, "second"], [60, "minute"], [24, "hour"], [7, "day"], [4.345, "week"], [12, "month"], [Infinity, "year"],
    ];
    let value = seconds;
    let unitLabel = "second";
    for (const [size, label] of units) {
        if (value < size) { unitLabel = label; break; }
        value = Math.floor(value / size);
        unitLabel = label;
    }
    if (value <= 1 && unitLabel === "second") return "just now";
    return `${value} ${unitLabel}${value === 1 ? "" : "s"} ago`;
}

export default function ProjectCard({
    id, name, role, updatedAt,
}: {
    id: string;
    name: string;
    role: string;
    updatedAt: Date;
}) {
    return (
        <Link href={`/project/${id}`}>
            <Card className="border-violet-100 transition-shadow hover:shadow-md hover:shadow-violet-100">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold text-[#17102b]">{name}</CardTitle>
                    {role === "owner" ? (
                        <Crown className="h-4 w-4 shrink-0 text-violet-500" />
                    ) : (
                        <Pencil className="h-4 w-4 shrink-0 text-slate-400" />
                    )}
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-500">Created {timeAgo(new Date(updatedAt))}</p>
                </CardContent>
            </Card>
        </Link>
    );
}
