"use client";

import * as React from "react";
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Untitled UI Badge API
// size, color, children, icon

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            color: {
                primary: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                success: "border-transparent bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                warning: "border-transparent bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                error: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                gray: "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
                outline: "text-foreground",
            },
            size: {
                sm: "text-[10px] px-2 py-0.5",
                md: "text-xs px-2.5 py-0.5",
                lg: "text-sm px-3 py-1",
            },
        },
        defaultVariants: {
            color: "primary",
            size: "md",
        },
    }
);

interface BadgeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">, VariantProps<typeof badgeVariants> {
    iconLeading?: React.ReactNode;
}

export const Badge = ({ className, color, size, iconLeading, children, ...props }: BadgeProps) => {
    return (
        <div className={cn(badgeVariants({ color, size }), className)} {...props}>
            {iconLeading && <span className="mr-1 flex items-center">{iconLeading}</span>}
            {children}
        </div>
    );
}
