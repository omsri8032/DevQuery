"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { LogOut, User as UserIcon, Settings, Menu, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";


import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Avatar } from "@/components/base/avatar/avatar";


import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";

export default function Header() {
    const { user, logout, loading, checkSession } = useAuthStore();
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

    useEffect(() => {
        setSearchQuery(searchParams.get("search") || "");
    }, [searchParams]);

    useEffect(() => {
        checkSession();
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [checkSession]);

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    const navItems = [
        { name: "Questions", href: "/#questions", icon: "/icons/question.png" },
        { name: "Tags", href: "/tags", icon: "/icons/tag.png" },
    ];

    return (
        <header
            className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${isScrolled
                ? "border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80"
                : "border-transparent bg-transparent"
                }`}
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-4">

                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-neutral-900 dark:text-white">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                            D
                        </span>
                        <span>Dev Query</span>
                    </Link>
                </div>


                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                        >
                            <Image src={item.icon} alt={item.name} width={20} height={20} className="w-5 h-5 opacity-70" />
                            {item.name}
                        </Link>
                    ))}


                    <div className="relative w-64">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const params = new URLSearchParams(searchParams.toString());
                            if (searchQuery) {
                                params.set("search", searchQuery);
                            } else {
                                params.delete("search");
                            }
                            router.push(`/?${params.toString()}`);
                        }}>
                            <input
                                type="text"
                                placeholder="Search questions..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                }}
                                className="w-full h-9 rounded-lg border border-neutral-200 bg-neutral-50 px-3 pl-9 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:ring-primary/20"
                            />
                            <Image src="/icons/search.png" alt="Search" width={16} height={16} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                        </form>
                    </div>
                </nav>


                <div className="hidden md:flex items-center gap-3">
                    {loading ? (
                        <div className="h-9 w-20 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-lg" />
                    ) : user ? (
                        <>
                            <Button
                                color="secondary"
                                size="sm"
                                onClick={() => router.push("/questions/ask")}
                                className="hidden lg:flex items-center gap-2 rounded-none"
                            >
                                <Image src="/icons/question (1).png" alt="" width={18} height={18} />
                                Ask Question
                            </Button>

                            <Dropdown.Root>
                                <Dropdown.Trigger asChild>
                                    <Button color="tertiary" size="icon" className="rounded-full overflow-hidden h-9 w-9">
                                        <Avatar
                                            src={(user.prefs as any)?.avatar || "/icons/boy.png"}
                                            alt={user.name}
                                            fallback={user.name?.charAt(0)}
                                            size="sm"
                                        />
                                    </Button>
                                </Dropdown.Trigger>
                                <Dropdown.Popover align="end" className="w-56">
                                    <Dropdown.Section>
                                        <div className="flex items-center gap-2 p-2">
                                            <Avatar src={(user.prefs as any)?.avatar || "/icons/boy.png"} size="xs" fallback={user.name?.charAt(0)} />
                                            <div className="flex flex-col space-y-0.5">
                                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </Dropdown.Section>
                                    <Dropdown.Separator />
                                    <Dropdown.Item icon={UserIcon} onClick={() => router.push("/profile")}>
                                        Profile
                                    </Dropdown.Item>
                                    <Dropdown.Item icon={Settings} onClick={() => router.push("/settings")}>
                                        Settings
                                    </Dropdown.Item>
                                    <Dropdown.Separator />
                                    <Dropdown.Item icon={LogOut} onClick={handleLogout} className="text-destructive focus:text-destructive">
                                        Log out
                                    </Dropdown.Item>
                                </Dropdown.Popover>
                            </Dropdown.Root>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button color="tertiary" size="sm">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button color="primary" size="sm">Sign up</Button>
                            </Link>
                        </>
                    )}
                </div>


                <Sheet>
                    <SheetTrigger asChild>
                        <Button size="icon" color="tertiary" className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <SheetHeader>
                            <SheetTitle className="text-left font-bold text-xl">
                                <span className="text-primary">D</span>ev Query
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-4 mt-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-3 text-lg font-medium text-neutral-600 dark:text-neutral-400"
                                >
                                    <Image src={item.icon} alt={item.name} width={24} height={24} className="w-6 h-6" />
                                    {item.name}
                                </Link>
                            ))}
                            <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-2" />
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 py-2">
                                        <Avatar src={(user.prefs as any)?.avatar || "/icons/boy.png"} size="sm" fallback={user.name?.charAt(0)} />
                                        <span className="font-medium">{user.name}</span>
                                    </div>
                                    <Button color="secondary" fullWidth onClick={() => router.push("/questions/ask")} className="flex items-center justify-center gap-2 rounded-none">
                                        <Image src="/icons/question (1).png" alt="" width={18} height={18} />
                                        Ask Question
                                    </Button>
                                    <Button color="secondary" fullWidth onClick={handleLogout}>
                                        Log out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login"><Button color="secondary" fullWidth>Login</Button></Link>
                                    <Link href="/register"><Button color="primary" fullWidth>Sign up</Button></Link>
                                </>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
