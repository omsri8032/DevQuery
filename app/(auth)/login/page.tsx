"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

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

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            setIsLoading(false);
            return;
        }

        try {
            // 1. Delete current session if exists
            try {
                await account.deleteSession("current");
            } catch (e) {
                // Ignore errors here.
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
            {/* Logo or Header could go here */}
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Log in to your account</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Welcome back! Please enter your details.
                </p>
            </div>

            <div className="grid gap-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <Input
                            label="Email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            type="email"
                            autoComplete="email"
                            disabled={isLoading}
                            isRequired
                        />
                        <Input
                            label="Password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            type="password"
                            autoComplete="current-password"
                            disabled={isLoading}
                            isRequired
                        />

                        {error && (
                            <p className="text-sm text-destructive text-center">{error}</p>
                        )}

                        <Button type="submit" disabled={isLoading} fullWidth color="primary" isLoading={isLoading}>
                            Sign in
                        </Button>
                    </div>
                </form>
            </div>

            <p className="px-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                Don&apos;t have an account?{" "}
                <Link
                    href="/register"
                    className="font-medium text-primary hover:text-primary/90 hover:underline"
                >
                    Sign up
                </Link>
            </p>
        </div>
    );
}
