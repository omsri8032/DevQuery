"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
    {
        variants: {
            color: {
                primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
                secondary: "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50 shadow-sm dark:bg-neutral-950 dark:text-neutral-300 dark:border-neutral-800 dark:hover:bg-neutral-800",
                tertiary: "bg-transparent text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800",
                "primary-destructive": "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
                "secondary-destructive": "bg-white text-destructive border border-destructive/30 hover:bg-destructive/10 shadow-sm",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                sm: "h-9 px-3 text-sm",
                md: "h-10 px-4 py-2 text-sm",
                lg: "h-11 px-5 text-base",
                xl: "h-12 px-6 text-lg",
                "2xl": "h-14 px-8 text-xl",
                icon: "h-10 w-10",
            },
            fullWidth: {
                true: "w-full",
            },
        },
        defaultVariants: {
            color: "primary",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
    iconLeading?: React.ReactNode;
    iconTrailing?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, color, size, fullWidth, isLoading, iconLeading, iconTrailing, children, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ color, size, fullWidth, className }))}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isLoading && iconLeading && <span className="mr-2 flex items-center">{iconLeading}</span>}
                {children}
                {!isLoading && iconTrailing && <span className="ml-2 flex items-center">{iconTrailing}</span>}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
