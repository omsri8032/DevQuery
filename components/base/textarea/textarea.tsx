"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    hint?: string;
    isRequired?: boolean;
    error?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ className, label, hint, isRequired, error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {label} {isRequired && <span className="text-destructive">*</span>}
                    </Label>
                )}
                <ShadcnTextarea
                    className={cn(
                        "min-h-[80px] rounded-lg border-neutral-300 bg-white focus-visible:ring-primary/20 focus-visible:border-primary dark:border-neutral-700 dark:bg-neutral-950",
                        error && "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {hint && !error && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{hint}</p>
                )}
                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}
            </div>
        );
    }
);
TextArea.displayName = "TextArea";

export { TextArea };
