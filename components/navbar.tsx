"use client"
import { Code2 } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useSession } from "@/lib/auth/auth-client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import SignOutButton from "./sign-out-btn";

export default function Navbar() {
    const { data: session } = useSession()

    return (
        <nav className="border-b border-violet-100 bg-white">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 font-mono text-xl font-bold text-[#17102b]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-600">
                        <Code2 className="h-4.5 w-4.5 text-white" />
                    </div>
                    SyncCode
                </Link>
                <div className="flex items-center gap-4">
                    {session?.user ? (
                        <>
                            <Link href="/dashboard">
                                <Button variant="ghost" className="text-slate-600 hover:text-[#17102b]">Dashboard</Button>
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-8 w-8 rounded-full" />}>
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-violet-600 text-white">
                                            {session.user.name?.[0]?.toUpperCase() ?? "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                                <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <SignOutButton />
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Link href="/sign-in"><Button variant="ghost" className="text-slate-600 hover:text-[#17102b]">Login</Button></Link>
                            <Link href="/sign-up"><Button className="bg-violet-600 hover:bg-violet-700">Sign Up</Button></Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
