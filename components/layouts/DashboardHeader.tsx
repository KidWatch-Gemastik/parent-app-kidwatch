import UserProfileDropdown from "@/components/layouts/UserProfileDropdown"


type header = {
    title: string
}
export default function DashboardHeader({ title }: header) {
    return (
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-emerald-400">{title}</h1>
            <UserProfileDropdown />
        </header>
    )
}
