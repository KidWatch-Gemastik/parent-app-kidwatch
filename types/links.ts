export interface NavbarLink {
    text: string;
    href: string;
}

export const guestLinks: NavbarLink[] = [
    { text: "Beranda", href: "/" },
    { text: "Tentang", href: "/about" },
    { text: "Fitur", href: "/features" },
    { text: "Kontak", href: "/contact" },
    { text: "Login", href: "/login" },
    { text: "Register", href: "/register" },
];

export const authLinks: NavbarLink[] = [
    { text: "Dashboard", href: "/dashboard" },
    { text: "Profil", href: "/dashboard/profile" },
    { text: "Pengaturan", href: "/dashboard/preferences" },
];