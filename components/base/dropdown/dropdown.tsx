"use client";
import * as React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Untitled UI wrapper
export const Dropdown = {
    Root: DropdownMenu,
    Trigger: DropdownMenuTrigger,
    Popover: ({ children, className, align = "end", ...props }: any) => (
        <DropdownMenuContent className={cn("w-56", className)} align={align} {...props}>
            {children}
        </DropdownMenuContent>
    ),
    Menu: ({ children }: any) => <>{children}</>,
    Section: ({ children }: any) => <DropdownMenuGroup>{children}</DropdownMenuGroup>,
    Item: ({ children, icon: Icon, addon, onClick, className, ...props }: any) => (
        <DropdownMenuItem onClick={onClick} className={cn("cursor-pointer", className)} {...props}>
            {Icon && (React.isValidElement(Icon) ? Icon : <Icon className="mr-2 h-4 w-4" />)}
            {children}
            {addon && <span className="ml-auto text-xs tracking-widest opacity-60">{addon}</span>}
        </DropdownMenuItem>
    ),
    Separator: DropdownMenuSeparator,
};
