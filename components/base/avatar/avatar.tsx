"use client";

import * as React from "react";
import { Avatar as ShadcnAvatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Untitled UI Avatar API
// src, alt, size, fallback

interface AvatarProps {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    className?: string; // Add className to interface
}

const sizeClasses = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-14 w-14 text-lg",
    "2xl": "h-16 w-16 text-xl",
};

export const Avatar = ({ src, alt, fallback, size = "md", className }: AvatarProps) => { // Accept className prop
    return (
        <ShadcnAvatar className={cn(sizeClasses[size], className)}>
            <AvatarImage src={src} alt={alt} />
            <AvatarFallback>{fallback || alt?.slice(0, 2).toUpperCase() || "UI"}</AvatarFallback>
        </ShadcnAvatar>
    );
};
