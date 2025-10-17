"use client"

import Link from "next/link"
import type * as React from "react"
import { type ReactNode, useState } from "react"
import { cn } from "@/lib/utils"
import { Shield, Bot, MapPin, MessageCircle, BarChart3, Smartphone, Star, CheckCircle, Sparkles } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Image from "next/image"

interface ComponentItem {
  title: string
  href: string
  description: string
  icon?: React.ElementType
}

interface MenuItem {
  title: string
  href?: string
  isLink?: boolean
  content?: ReactNode
}

interface NavigationProps {
  menuItems?: MenuItem[]
  components?: ComponentItem[]
  logo?: ReactNode
  logoTitle?: string
  logoDescription?: string
  logoHref?: string
  introItems?: {
    title: string
    href: string
    description: string
    icon?: React.ElementType
  }[]
  selectedItem?: string
  onItemSelect?: (item: string) => void
}

const KiddyGooLogo = () => (
  <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-xl shadow-xl animate-pulse">
    {/* <Shield className="w-5 h-5 text-white" /> */}
    <Image src={'/logo/KiddyGologo.png'} loading="eager" alt="KiddyGoo Logo Icon" width={100} height={100} />

  </div>
)

export default function Navigation({
  menuItems = [
    {
      title: "Fitur",
      content: "features",
    },
    {
      title: "Solusi",
      content: "solutions",
    },
    {
      title: "Harga",
      isLink: true,
      href: "#pricing",
    },
    {
      title: "Dukungan",
      isLink: true,
      href: "#support",
    },
  ],
  components = [
    {
      title: "AI Assistant",
      href: "#ai-assistant",
      description: "Asisten AI cerdas yang menganalisis aktivitas digital anak dengan teknologi machine learning",
      icon: Bot,
    },
    {
      title: "Location Tracking",
      href: "#location",
      description: "Pantau lokasi anak secara real-time dengan GPS akurat dan geofencing otomatis",
      icon: MapPin,
    },
    {
      title: "Real-time Chat",
      href: "#chat",
      description: "Komunikasi langsung dengan anak melalui chat aman dan realtime lintas device",
      icon: MessageCircle,
    },
    {
      title: "Analytics Dashboard",
      href: "#analytics",
      description: "Dashboard lengkap dengan insights mendalam tentang aktivitas dan kebiasaan digital anak",
      icon: BarChart3,
    },
    {
      title: "Screen Time Control",
      href: "#screen-time",
      description: "Kontrol waktu layar dengan pembatasan aplikasi dan jadwal penggunaan yang fleksibel",
      icon: Smartphone,
    },
    {
      title: "Safety Monitoring",
      href: "#safety",
      description: "Monitoring keamanan otomatis dengan deteksi konten berbahaya dan alert real-time",
      icon: Shield,
    },
  ],
  logo = <KiddyGooLogo />,
  logoTitle = "KiddyGoo",
  logoDescription = "Solusi pengawasan anak terdepan dengan teknologi AI untuk melindungi anak di era digital",
  logoHref = "#home",
  introItems = [
    {
      title: "Mulai Cepat",
      href: "#getting-started",
      description: "Panduan lengkap setup KiddyGoo dalam 5 menit untuk perlindungan maksimal",
      icon: Sparkles,
    },
    {
      title: "Download App",
      href: "#download-app",
      description: "Download aplikasi KiddyGoo untuk Android dan iOS dengan fitur lengkap",
      icon: Smartphone,
    },
    {
      title: "Testimoni",
      href: "#testimonials",
      description: "Dengarkan pengalaman 50,000+ keluarga yang telah mempercayai KiddyGoo",
      icon: Star,
    },
  ],
  selectedItem,
  onItemSelect,
}: NavigationProps) {
  const [activeItem, setActiveItem] = useState(selectedItem || "")

  const handleItemClick = (item: string) => {
    setActiveItem(item)
    onItemSelect?.(item)
  }

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {menuItems.map((item, index) => (
          <NavigationMenuItem key={index}>
            {item.isLink ? (
              <NavigationMenuLink
                href={item.href}
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-gray-300 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-300 hover:scale-105",
                  activeItem === item.title && "text-emerald-400 bg-emerald-500/10",
                )}
                onClick={() => handleItemClick(item.title)}
              >
                {item.title}
                {activeItem === item.title && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                )}
              </NavigationMenuLink>
            ) : (
              <>
                <NavigationMenuTrigger
                  className={cn(
                    "text-gray-300 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-300 hover:scale-105 relative",
                    activeItem === item.title && "text-emerald-400 bg-emerald-500/10",
                  )}
                  onClick={() => handleItemClick(item.title)}
                >
                  {item.title}
                  {activeItem === item.title && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                  )}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-gray-900/95 backdrop-blur-xl border border-emerald-500/20">
                  {item.content === "features" ? (
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b from-emerald-500/10 to-mint-500/5 p-6 no-underline outline-none select-none focus:shadow-md hover:bg-gradient-to-b hover:from-emerald-500/20 hover:to-mint-500/10 transition-all duration-300 border border-emerald-500/20"
                            href={logoHref}
                          >
                            {logo}
                            <div className="mt-4 mb-2 text-lg font-medium text-white">{logoTitle}</div>
                            <p className="text-gray-300 text-sm leading-tight">{logoDescription}</p>
                            <div className="flex items-center gap-1 mt-3">
                              <CheckCircle className="w-3 h-3 text-emerald-400" />
                              <span className="text-xs text-emerald-400">Trusted by 50K+ families</span>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      {introItems.map((intro, i) => (
                        <ListItem key={i} href={intro.href} title={intro.title} icon={intro.icon}>
                          {intro.description}
                        </ListItem>
                      ))}
                    </ul>
                  ) : item.content === "solutions" ? (
                    <ul className="grid w-[400px] gap-3 p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {components.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                          icon={component.icon}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  ) : (
                    item.content
                  )}
                </NavigationMenuContent>
              </>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({
  className,
  title,
  children,
  icon: Icon,
  ...props
}: React.ComponentProps<"a"> & { title: string; icon?: React.ElementType }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href="#"
          data-slot="list-item"
          className={cn(
            "block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 select-none hover:bg-emerald-500/10 hover:text-emerald-400 focus:bg-emerald-500/10 focus:text-emerald-400 border border-transparent hover:border-emerald-500/20 group",
            className,
          )}
          {...props}
        >
          <div className="flex items-center gap-2 text-sm leading-none font-medium text-white group-hover:text-emerald-400 transition-colors">
            {Icon && (
              <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-3 h-3 text-white" />
              </div>
            )}
            {title}
          </div>
          <p className="text-gray-400 line-clamp-2 text-sm leading-snug group-hover:text-gray-300 transition-colors">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
