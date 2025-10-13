"use client";

import {
  LayoutDashboard,
  MapPin,
  PhoneCall,
  ShieldCheck,
  CalendarDays,
  BarChart3,
  Bell,
  Menu,
  ChevronLeft,
  ChevronRight,
  Bot,
  Plus,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export const navGroups = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { label: "Stats", icon: BarChart3, href: "/dashboard/stats" },
      { label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
      { label: "AI Assistant", icon: Bot, href: "/dashboard/ai-assistant" },
    ],
  },
  {
    title: "Monitoring Anak",
    items: [
      { label: "Anak", icon: Users, href: "/dashboard/perangkat" },
      { label: "Location", icon: MapPin, href: "/dashboard/location" },
      { label: "Logs", icon: PhoneCall, href: "/dashboard/logs" },
      { label: "Safe Zones", icon: ShieldCheck, href: "/dashboard/safe-zones" },
      { label: "Schedule", icon: CalendarDays, href: "/dashboard/schedule" },
      { label: "Chat dengan Anak", icon: Sparkles, href: "/dashboard/chat" },
    ],
  },
];

export default function DashboardSidebar() {
  // const supabase = createClientComponentClient()
  // const router = useRouter()
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // const handleLogout = async () => {
  //     await supabase.auth.signOut()
  //     router.push("/login")
  // }

  const SidebarContent = () => (
    <TooltipProvider>
      <div className="flex flex-col h-full relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-transparent to-mint-900/10 pointer-events-none" />

        {/* Header + Collapse Toggle */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-xl flex items-center justify-center shadow-lg">
                <Image
                  src={"/logo/KiddyGo-Logo.png"}
                  className="w-32"
                  loading="eager"
                  alt="KiddyGoo Logo Icon"
                  width={100}
                  height={100}
                />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-mint-300 bg-clip-text text-transparent">
                  KiddyGoo
                </h2>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs text-gray-400 font-light">
                    Parent Portal
                  </span>
                </div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 md:flex hidden hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all duration-300 hover:scale-110"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 relative z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500/20 hover:scrollbar-thumb-emerald-500/40">
          {navGroups.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {group.title}
                </div>
              )}
              <div className="space-y-2">
                {group.items.map(({ label, icon: Icon, href }) => {
                  const isActive = pathname === href;

                  const buttonContent = (
                    <Link key={label} href={href} className="block">
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full transition-all duration-300 rounded-xl group relative overflow-hidden",
                          collapsed
                            ? "justify-center px-3 h-12"
                            : "justify-start gap-3 h-12 px-4",
                          isActive
                            ? "bg-gradient-to-r from-emerald-500/20 to-mint-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                            : "text-gray-300 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 border border-transparent"
                        )}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-mint-400 rounded-r-full" />
                        )}
                        <Icon
                          className={`w-5 h-5 relative z-10 transition-all duration-300 ${
                            collapsed ? "scale-[3]" : "hover:scale-110"
                          }`}
                        />
                        {!collapsed && (
                          <span className="relative z-10 font-medium">
                            {label}
                          </span>
                        )}
                        {isActive && !collapsed && (
                          <div className="absolute right-3 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        )}
                      </Button>
                    </Link>
                  );

                  return collapsed ? (
                    <Tooltip key={label}>
                      <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-gray-900/95 backdrop-blur-xl border-emerald-500/30 text-emerald-400"
                      >
                        {label}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    buttonContent
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Separator */}
        <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

        {/* Bottom Actions */}
        <div className="space-y-3 relative z-10">
          {collapsed ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/dashboard/perangkat">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-full h-12 text-mint-400 hover:text-mint-300 hover:bg-mint-500/10 rounded-xl transition-all duration-300 hover:scale-110 border border-transparent hover:border-mint-500/20"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-gray-900/95 backdrop-blur-xl border-mint-500/30 text-mint-400"
                >
                  Kelola Anak
                </TooltipContent>
              </Tooltip>
            </>
          ) : (
            <>
              <Link href="/dashboard/perangkat">
                <Button
                  variant="ghost"
                  className="w-full h-12 justify-start gap-3 px-4 text-mint-400 hover:text-mint-300 hover:bg-mint-500/10 rounded-xl transition-all duration-300 border border-transparent hover:border-mint-500/20 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-mint-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <Plus className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative z-10 font-medium">Kelola Anak</span>
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Footer */}
        {!collapsed && (
          <div className="mt-6 pt-4 border-t border-gray-700/50">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-800/50 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-700/50">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>Secure & Protected</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-xl backdrop-blur-sm bg-gray-900/80 border border-emerald-500/30"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-gray-900/95 backdrop-blur-xl border-emerald-500/30 text-white w-80 p-6"
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-gray-900/90 backdrop-blur-xl border-r border-emerald-500/30 min-h-screen p-6 text-white transition-all duration-300 shadow-2xl relative overflow-hidden",
          collapsed ? "w-20" : "w-80"
        )}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/5 via-transparent to-mint-900/5" />
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-500/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-mint-500/10 to-transparent" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />

        <SidebarContent />
      </aside>
    </>
  );
}
