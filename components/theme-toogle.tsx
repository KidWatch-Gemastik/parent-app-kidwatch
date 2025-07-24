"use client";

import * as React from "react";
import { Moon, Sun, Laptop2 } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

export function ModeToggle() {
    const { setTheme } = useTheme();

    const iconSize = 18;
    const iconClass = "mr-2 h-4 w-4";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Sun
                        className={cn(
                            "absolute transition-transform duration-300",
                            "scale-100 rotate-0 dark:scale-0 dark:-rotate-90"
                        )}
                        size={iconSize}
                    />
                    <Moon
                        className={cn(
                            "absolute transition-transform duration-300",
                            "scale-0 rotate-90 dark:scale-100 dark:rotate-0"
                        )}
                        size={iconSize}
                    />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className={iconClass} />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className={iconClass} />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Laptop2 className={iconClass} />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
