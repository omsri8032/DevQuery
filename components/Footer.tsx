import React from "react";

export default function Footer() {
    return (
        <footer className="w-full text-center text-neutral-500 text-sm py-8 border-t border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950">
            © {new Date().getFullYear()} Dev Query. Built by OM SRIVASTAVA.
        </footer>
    );
}
