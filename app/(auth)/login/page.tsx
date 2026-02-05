"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { setAuth } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            setError("Please fill in all fields");
            setIsLoading(false);
            return;
        }

        try {
            // 1. Delete current session if exists
            try {
                await account.deleteSession("current");
            } catch (e) {
                // Ignore errors here. If 401, it means we are already logged out, which is what we want.
            }

            // 2. Create Session
            const session = await account.createEmailPasswordSession(email, password);

            // 2. Get User Details
            const user = await account.get();

            // 3. Update Store
            setAuth(user, session);

            router.push("/");
        } catch (err: any) {
            setError(err.message || "Invalid credentials");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email to sign in to your account
                </p>
            </div>

            <div className="grid gap-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="email">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                placeholder="name@example.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="password">
                                Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                placeholder="Password"
                                type="password"
                                autoComplete="current-password"
                                disabled={isLoading}
                            />
                        </div>
                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}
                        <Button disabled={isLoading}>
                            {isLoading && (
                                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            )}
                            Sign In with Email
                        </Button>
                    </div>
                </form>
            </div>

            <p className="px-8 text-center text-sm text-muted-foreground">
                <Link
                    href="/register"
                    className="hover:text-brand underline underline-offset-4"
                >
                    Don&apos;t have an account? Sign Up
                </Link>
            </p>
        </div>
    );
}
