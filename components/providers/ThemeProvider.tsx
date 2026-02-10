"use client";

import { useEffect } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Force light mode only
        const root = window.document.documentElement;
        root.classList.remove("dark");
        root.classList.add("light");
    }, []);

    return <>{children}</>;
}
