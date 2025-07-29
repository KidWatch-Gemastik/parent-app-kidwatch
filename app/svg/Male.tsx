import { cn } from "@/lib/utils"

export function MaleIcon({ className }: { className?: string }) {
    return (
        <svg
            className={cn("w-4 h-4 text-blue-500", className)}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path d="M14 3h7m0 0v7m0-7L10 17" />
            <circle cx="10" cy="14" r="5" />
        </svg>
    )
}
