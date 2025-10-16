export interface NavbarLink {
  text: string;
  href: string;
}

export const guestLinks: NavbarLink[] = [
  { text: "Beranda", href: "/" },
  { text: "Tentang", href: "#getting-started" },
  { text: "Fitur", href: "#ai-assistant" },
  { text: "Price", href: "#price" },
  { text: "Login", href: "/login" },
];

export const authLinks: NavbarLink[] = [
  { text: "Dashboard", href: "/dashboard" },
  { text: "Profil", href: "/dashboard/profile" },
  { text: "Pengaturan", href: "/dashboard/preferences" },
];
