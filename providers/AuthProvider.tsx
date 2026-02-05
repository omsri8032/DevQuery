"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { account } from "@/lib/appwrite";
import { useEffect } from "react";
import { Models } from "appwrite";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { setAuth, session } = useAuthStore();

    useEffect(() => {
        const initAuth = async () => {
            // If we don't have a session in store, try to fetch the current account
            // This handles page reloads where zustand persist might be stale or cleared
            try {
                const user = await account.get();
                // We can't easily get the session object again without a login call or session list,
                // but for now, if account.get() succeeds, we are logged in.
                // We might need to mock a session object or just rely on the user object for now.
                // For strict typing, let's keep the existing session if available, or create a mock one.
                // In a real app, you might want to fetch the session ID specifically if needed.
                if (user) {
                    setAuth(user, session as Models.Session);
                }
            } catch (error) {
                // Not logged in or session invalid
                // console.log("Restoring session: User not logged in");
                setAuth(null as any, null as any); // Clear stale state if any
            }
        };

        initAuth();
    }, [setAuth, session]);

    return <>{children}</>;
}
