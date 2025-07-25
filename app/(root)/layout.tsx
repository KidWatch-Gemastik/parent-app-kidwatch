import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};
import Navbar from "@/components/sections/navbar/default";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <main>
                {children}
            </main>
        </>
    );
}
