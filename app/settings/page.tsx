"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Avatar } from "@/components/base/avatar/avatar";
import { account, avatars } from "@/lib/appwrite";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const { user, checkSession } = useAuthStore();
    const router = useRouter();

    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
        } else {
            // Redirect if not logged in
            // router.push("/login"); // Optional: handled by header logic usually, but good to have.
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await account.updateName(name);
            await checkSession(); // Refresh user data
            alert("Profile updated successfully!");
        } catch (error: any) {
            console.error(error);
            alert("Failed to update profile: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return <div className="p-10 text-center">Please login to view settings.</div>;

    return (
        <div className="container max-w-2xl py-10 space-y-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-8">Settings</h1>

            {/* Profile Section */}
            <section className="space-y-6 border p-6 rounded-2xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Update Profile</h2>

                <div className="flex items-center gap-4">
                    <Avatar
                        src={(user.prefs as any)?.avatar}
                        alt={user.name}
                        fallback={user.name.charAt(0)}
                        size="xl"
                    />
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <Input
                        label="Display Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                    />
                    <Button type="submit" isLoading={isLoading} color="primary">
                        Update Profile
                    </Button>
                </form>
            </section>
        </div>
    );
}
