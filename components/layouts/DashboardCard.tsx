import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DashboardCardProps {
    icon: React.ReactNode
    title: string
    description: string
    action: string
}

export default function DashboardCard({
    icon,
    title,
    description,
    action,
}: DashboardCardProps) {
    return (
        <Card className="bg-gray-900 border border-emerald-500/20 shadow-md hover:shadow-emerald-500/20 transition">
            <CardHeader className="flex items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg text-emerald-300 flex gap-2 items-center">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{description}</p>
                <Button variant="outline" size="sm" className="w-full">
                    {action}
                </Button>
            </CardContent>
        </Card>
    )
}
