import { cn } from "@/lib/utils"

export function FemaleIcon({ className }: { className?: string }) {
    return (
        <svg
            className={cn("w-4 h-4 text-pink-500", className)}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <circle cx="12" cy="8" r="5" />
            <path d="M12 13v7m-3-3h6" />
        </svg>
    )
}
