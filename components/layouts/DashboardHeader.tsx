import UserProfileDropdown from "@/components/layouts/UserProfileDropdown";
import { Sparkles } from "lucide-react";
import { NotificationBell } from "./NotificationBell";

type header = {
    title: string;
    description?: string;
    subtitle?: string;
    className?: string;
};

export default function DashboardHeader({ title, description, subtitle, className }: header) {
    return (
        <header className={`flex justify-between items-center mb-6 ${className}`}>
            <div className="flex flex-col gap-1 items-start">
                <h1 className="text-2xl font-bold text-emerald-400">{title}</h1>
                {subtitle && <p className="text-muted-foreground mt-1 text-pretty">{subtitle}</p>}
                {description && (
                    <div className="flex items-center gap-2 mt-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <p className="text-gray-400 text-sm">{description}</p>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <NotificationBell />
                <UserProfileDropdown />
            </div>
        </header>
    );
}
