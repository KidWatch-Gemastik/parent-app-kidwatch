"use client";

import { LogOut, Menu } from "lucide-react";
import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import LaunchUI from "../../logos/launch-ui";
import { Button } from "../../ui/button";
import {
  Navbar as NavbarComponent,
  NavbarLeft,
  NavbarRight,
} from "../../ui/navbar";
import Navigation from "../../ui/navigation";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import { ModeToggle } from "@/components/theme-toogle";

import { guestLinks, authLinks, type NavbarLink } from "@/types/links";
import { useSupabaseAuthSession } from "@/hooks/useSupabaseAuthSession";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import Image from "next/image";
import { DashboardIcon } from "@radix-ui/react-icons";
import { useSupabase } from "@/providers/SupabaseProvider";

interface NavbarProps {
  logo?: ReactNode;
  name?: string;
  homeUrl?: string;
  showNavigation?: boolean;
  customNavigation?: ReactNode;
  className?: string;
}

export default function Navbar({
  logo =  <Image src={'/logo/KiddyGo - Horizontal.png'} className="w-32" loading="eager" alt="KiddyGoo Logo Horizontal" width={100} height={100} />,
  name = "KiddyGoo",
  homeUrl = "/",
  showNavigation = true,
  customNavigation,
  className,
}: NavbarProps) {
  const { user } = useSupabaseAuthSession();
  const { supabase } = useSupabase();
  const router = useRouter();

  const currentLinks: NavbarLink[] = user ? authLinks : guestLinks;
  const avatar = user?.user_metadata?.avatar_url;

  const handleLogout = async () => {
    localStorage.removeItem("kidy-goo-auth");
    await supabase.auth.signOut();
    router.refresh();
    router.replace("/login");
  };

  return (
    <header className={cn("sticky top-0 z-50 -mb-4 px-4 pb-4", className)}>
      <div className="fade-bottom bg-background/15 absolute left-0 h-20 w-full backdrop-blur-lg" />
      <div className="max-w-container relative mx-auto">
        <NavbarComponent>
          <NavbarLeft>
            <Link
              href={homeUrl}
              className="flex items-center gap-2 text-xl font-bold"
            >
              {logo}
              {/* {name} */}
            </Link>
            {showNavigation && (customNavigation || <Navigation />)}
          </NavbarLeft>

          {/* ⬇️ Key untuk paksa re-render ketika user logout */}
          <NavbarRight key={user?.id ?? "guest"}>
            <ModeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer flex items-center gap-2">
                    <Avatar className="h-8 w-8 ring-2 ring-emerald-500/30">
                      {avatar ? (
                        <Image
                          src={avatar}
                          width={100}
                          height={100}
                          alt={name}
                          className="rounded-full"
                        />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white">
                          {user?.email?.[0]?.toUpperCase() ?? "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="hidden md:inline">{name}</span>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.replace("/dashboard")}>
                    <DashboardIcon className="h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login" className="hidden text-sm md:block">
                  Masuk
                </Link>
                <Button variant="default" asChild>
                  <Link href="/register">Daftar</Link>
                </Button>
              </>
            )}

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    href={homeUrl}
                    className="flex items-center gap-2 text-xl font-bold"
                  >
                    <span>{name}</span>
                  </Link>
                  {currentLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {link.text}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </NavbarRight>
        </NavbarComponent>
      </div>
    </header>
  );
}
