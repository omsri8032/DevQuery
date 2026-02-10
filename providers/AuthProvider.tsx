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
            try {
                const user = await account.get();
                if (user) {
                    setAuth(user, session as Models.Session);
                }
            } catch (error) {
                setAuth(null as any, null as any);
            }
        };

        initAuth();
    }, []);

    return <>{children}</>;
}
