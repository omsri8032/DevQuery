"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import { useAuthStore } from "@/store/useAuthStore";
import { ID } from "appwrite";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { setAuth } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!name || !email || !password) {
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
            // 1. Create Account
            await account.create(ID.unique(), email, password, name);

            // 1b. Delete current session if exists
            try {
                await account.deleteSession("current");
            } catch (e) {
                // Ignore errors here.
            }

            // 2. Create Session (Login)
            const session = await account.createEmailPasswordSession(email, password);

            // 3. Get User Details
            const user = await account.get();

            // 4. Update Store
            setAuth(user, session);

            router.push("/");
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                    Create an account
                </h1>
            </div>

            <div className="grid gap-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <Input
                            label="Name"
                            id="name"
                            name="name"
                            placeholder="Enter your name"
                            type="text"
                            disabled={isLoading}
                            isRequired
                        />
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
                            placeholder="Create a password"
                            type="password"
                            hint="Must be at least 8 characters."
                            autoComplete="new-password"
                            disabled={isLoading}
                            isRequired
                        />
                        {error && (
                            <p className="text-sm text-destructive text-center">{error}</p>
                        )}
                        <Button type="submit" disabled={isLoading} fullWidth color="primary" isLoading={isLoading}>
                            Get started
                        </Button>
                    </div>
                </form>
            </div>

            <p className="px-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-medium text-primary hover:text-primary/90 hover:underline"
                >
                    Log in
                </Link>
            </p>
        </div>
    );
}
