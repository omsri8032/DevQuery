"use client";

import Link from "next/link";
import React from "react";
import { User, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Header() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await account.deleteSession("current");
        } catch (error) {
            // Force logout even if API fails (e.g. 401 session expired)
            console.error("Logout failed or session already expired", error);
        }
        logout();
        router.push("/login"); // Fixed: router.push instead of router.replace for better history handling
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">
                            QNA
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Questions
                        </Link>
                        <Link
                            href="/tags"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Tags
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const query = formData.get("q");
                                if (query) {
                                    router.push(`/?search=${query}`);
                                }
                            }}
                        >
                            <div className="relative">
                                <input
                                    name="q"
                                    type="text"
                                    placeholder="Search..."
                                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:w-[300px] lg:w-[300px]"
                                />
                            </div>
                        </form>
                    </div>
                    <nav className="flex items-center gap-2">
                        {user ? (
                            <>
                                <span className="text-sm text-muted-foreground hidden sm:inline-block">
                                    {user.name}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleLogout}
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </>
                        ) : (
                            <Link href="/login" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0">
                                <User className="h-5 w-5" />
                                <span className="sr-only">Login</span>
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
