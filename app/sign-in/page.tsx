"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { signIn } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const result = await signIn.email({ email, password });

            if (result.error) {
                setError(result.error.message || "Failed to sign in.");
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            setError("Failed to sign in. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
            <Card className="w-full max-w-md border-violet-100 shadow-lg shadow-violet-100/50">
                <CardHeader className="space-y-1">
                    <CardTitle className="font-mono text-2xl font-bold text-[#17102b]">Login</CardTitle>
                    <CardDescription className="text-slate-500">Sign in to get back to your workspace.</CardDescription>
                </CardHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (<div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>)}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700">Email</Label>
                            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="border-violet-200 focus-visible:border-violet-500 focus-visible:ring-violet-500" id="email" type="email" placeholder="john@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-700">Password</Label>
                            <Input value={password} onChange={(e) => setPassword(e.target.value)} minLength={7} className="border-violet-200 focus-visible:border-violet-500 focus-visible:ring-violet-500" id="password" type="password" placeholder="••••••••" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button disabled={loading} className="w-full bg-violet-600 hover:bg-violet-700" type="submit">
                            {loading ? "Logging In..." : "Login"}
                        </Button>
                        <p className="text-center text-sm text-slate-500">Don&apos;t have an account? <Link className="font-medium text-violet-600 hover:underline" href="/sign-up">Sign Up</Link></p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
