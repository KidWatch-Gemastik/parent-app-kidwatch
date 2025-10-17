import {
  Download,
  Globe,
  Headphones,
  Lock,
  Rocket,
  Shield,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Enhanced Footer */}
      <footer id="download-app" className="border-t border-emerald-500/20 bg-gray-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-xl shadow-xl animate-pulse">
                  <Image
                    src={"/logo/KiddyGologo.png"}
                    className="w-32"
                    loading="eager"
                    alt="KiddyGoo Logo Icon"
                    width={100}
                    height={100}
                  />
                </div>
                <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-emerald-400 via-mint-300 to-emerald-500 bg-clip-text text-transparent">
                  KiddyGoo
                </h3>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                  v1.0
                </Badge>
              </div>
              <p className="text-gray-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                Solusi pengawasan anak terdepan yang memberikan ketenangan
                pikiran bagi orang tua di era digital. Dengan teknologi AI
                canggih dan interface yang user-friendly.
              </p>
              <div className="flex flex-wrap gap-2 md:gap-4">
                <Link href={"https://kiddygoo.my.id/"} target="_blank">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-emerald-500/30 text-emerald-400 bg-transparent hover:bg-emerald-500/10 hover:scale-105 transition-all duration-300"
                  >
                    <Globe className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    Website
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-emerald-500/30 text-emerald-400 bg-transparent hover:bg-emerald-500/10 hover:scale-105 transition-all duration-300"
                >
                  <Download className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  Android
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Rocket className="w-4 h-4 text-emerald-400" />
                Produk
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link
                    href="#"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-400 rounded-full"></div>
                    KiddyGoo Parent
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-mint-400 rounded-full"></div>
                    KiddyGoo Child
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full"></div>
                    AI Assistant
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-pink-400 rounded-full"></div>
                    Premium Features
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Headphones className="w-4 h-4 text-emerald-400" />
                Dukungan
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link
                    href="#"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full"></div>
                    Pusat Bantuan
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full"></div>
                    Panduan
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-400 rounded-full"></div>
                    Kontak
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-400 rounded-full animate-pulse"></div>
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-emerald-500/20 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} KiddyGoo. Semua hak dilindungi. Made with ❤️ in
              Indonesia
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
              <Link
                href="#"
                className="text-gray-400 hover:text-emerald-400 text-sm transition-colors hover:scale-105"
              >
                Kebijakan Privasi
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-emerald-400 text-sm transition-colors hover:scale-105"
              >
                Syarat Layanan
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Lock className="w-3 h-3 animate-pulse" />
                <span>Keamanan Terjamin</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
