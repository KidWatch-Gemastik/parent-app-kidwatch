"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Lock,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSupabaseSessionError } from "@/hooks/useSupabaseSessionError";

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [lastOtpSent, setLastOtpSent] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    if (countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  });

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: null, message: "" }), 7000);
  };

  useSupabaseSessionError(showAlert);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLogin = async () => {
    if (!emailOrPhone.trim()) {
      showAlert("error", "Mohon masukkan email Anda");
      return;
    }

    const isEmail = emailOrPhone.includes("@");
    if (!isEmail) {
      showAlert("error", "Format email tidak valid");
      return;
    }

    setIsLoading(true);
    setAlert({ type: null, message: "" });

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: emailOrPhone,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        const msg = error?.message?.toLowerCase() || "";
        if (
          msg.includes("expired") ||
          msg.includes("kode otp telah kedaluwarsa")
        ) {
          showAlert(
            "error",
            "Link login telah kedaluwarsa. Silakan kirim ulang."
          );
        } else {
          showAlert("error", error.message);
        }
      } else {
        showAlert("success", "Link login telah dikirim ke email Anda.");
      }
    } catch {
      showAlert("error", "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "facebook") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });
      if (error) showAlert("error", error.message);
    } catch {
      showAlert("error", "Terjadi kesalahan saat masuk. Silakan coba lagi.");
    }
  };

  const isPhone = !emailOrPhone.includes("@") && emailOrPhone.trim() !== "";
  const isCountdownActive =
    countdown > 0 && lastOtpSent === emailOrPhone && isPhone;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-mint-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-3rem)]">
          <div className="flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full">
              {/* Logo and Brand */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-xl mb-4 shadow-xl">
                  <Image
                    src={"/logo/KiddyGologo.png"}
                    className="w-32"
                    loading="eager"
                    alt="KiddyGoo Logo Icon"
                    width={100}
                    height={100}
                  />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-mint-300 to-emerald-500 bg-clip-text text-transparent mb-1">
                  KiddyGoo
                </h1>
                <p className="text-gray-400 text-sm font-light flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Selamat datang kembali
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                </p>
              </div>

              <Card className="border border-emerald-500/20 shadow-xl bg-gray-900/80 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-mint-500/5 pointer-events-none"></div>

                <CardHeader className="space-y-1 pb-6 relative">
                  <CardTitle className="text-xl font-bold text-center text-white">
                    Masuk ke Akun Anda
                  </CardTitle>
                  <CardDescription className="text-center text-gray-300 text-sm font-light">
                    Masukkan email untuk melanjutkan
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5 relative">
                  {alert.type && (
                    <Alert
                      variant={
                        alert.type === "error" ? "destructive" : "success"
                      }
                      className="backdrop-blur-sm"
                    >
                      {alert.type === "error" ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      <AlertDescription className="text-sm">
                        {alert.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  {isCountdownActive && (
                    <Alert className="backdrop-blur-sm border-amber-500/50 bg-amber-950/30">
                      <Clock className="h-4 w-4 text-amber-400" />
                      <AlertDescription className="text-sm text-amber-400">
                        Tunggu {formatTime(countdown)} sebelum mengirim OTP lagi
                      </AlertDescription>
                    </Alert>
                  )}

                  <form
                    className="space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleLogin();
                    }}
                  >
                    <div className="space-y-2">
                      <Label
                        htmlFor="emailOrPhone"
                        className="text-gray-200 text-sm font-medium"
                      >
                        Email
                      </Label>
                      <div className="relative group">
                        <Input
                          id="emailOrPhone"
                          placeholder="nama@email.com"
                          value={emailOrPhone}
                          onChange={(e) => setEmailOrPhone(e.target.value)}
                          className="pl-10 h-11 text-sm border-gray-700 bg-gray-800/50 focus:border-emerald-500 focus:ring-emerald-500/30 focus:ring-1 text-white placeholder:text-gray-400 transition-all duration-300"
                          disabled={isLoading}
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 group-focus-within:text-emerald-400">
                          {emailOrPhone.includes("@") ? (
                            <Mail className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Mail className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="ghost"
                      className={cn(
                        "w-full text-sm font-semibold transition-all duration-300 transform",
                        "bg-gradient-to-r from-emerald-500 to-emerald-500 text-white shadow-lg",
                        "hover:from-emerald-600 hover:to-mint-600 hover:shadow-emerald-500/25 hover:scale-[1.01]",
                        isLoading && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={isLoading || isCountdownActive}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Mengirim...
                        </>
                      ) : isCountdownActive ? (
                        <>
                          <Clock className="mr-2 h-4 w-4" />
                          Tunggu {formatTime(countdown)}
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          {isPhone ? "Kirim OTP" : "Kirim Link Login"}
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full bg-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-gray-900 px-3 text-gray-400 font-medium">
                        atau lanjutkan dengan
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <Button
                      variant="outline"
                      className="w-full h-12 text-sm px-4 py-2 border border-gray-700 bg-gray-800/60 hover:bg-gray-700/50 text-white font-medium transition-all duration-300 hover:border-emerald-500/60 rounded-xl flex items-center justify-center gap-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleOAuth("google")}
                      disabled={isLoading}
                    >
                      <Image
                        src="/source/icons/google.svg"
                        alt="Google Login"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                      Masuk dengan Google
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full h-12 text-sm px-4 py-2 border border-gray-700 bg-gray-800/60 hover:bg-gray-700/50 text-white font-medium transition-all duration-300 hover:border-emerald-500/60 rounded-xl flex items-center justify-center gap-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleOAuth("facebook")}
                      disabled={isLoading}
                    >
                      <Image
                        src="/source/icons/facebook.svg"
                        alt="Facebook Login"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                      Masuk dengan Facebook
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center mt-6 text-gray-400">
                <p className="text-sm font-light">
                  Belum punya akun?{" "}
                  <Link
                    href={"/register"}
                    className="px-0 text-emerald-400 hover:text-emerald-300 text-sm h-auto font-medium transition-colors duration-300"
                  >
                    Daftar sekarang
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex flex-col justify-center items-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-mint-500/10 rounded-2xl transform rotate-3 blur-xl"></div>

              <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-emerald-500/20">
                <Image
                  src="/kiddygoo/Kids playing with car toys-cuate.svg?height=300&width=300&text=Kids+Digital+Safety"
                  alt="Anak-anak menggunakan teknologi dengan aman"
                  width={300}
                  height={300}
                  className="w-full h-60 object-cover rounded-xl shadow-lg"
                />
                <div className="mt-5 text-center">
                  <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-emerald-400 to-mint-400 bg-clip-text text-transparent">
                    Lindungi Anak Anda di Era Digital
                  </h3>
                  <p className="text-gray-300 font-light leading-relaxed text-sm">
                    KiddyGoo memberikan perlindungan terdepan untuk aktivitas
                    online anak-anak dengan teknologi AI yang canggih.
                  </p>
                </div>
              </div>
            </div>

            {/* Compact Features */}
            <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-xl p-4 text-center border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-white text-sm mb-1">
                  Keamanan Premium
                </h4>
                <p className="text-gray-300 font-light text-xs">
                  Perlindungan tingkat enterprise
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-xl p-4 text-center border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group">
                <div className="w-8 h-8 bg-gradient-to-r from-mint-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-white text-sm mb-1">
                  AI Monitoring
                </h4>
                <p className="text-gray-300 font-light text-xs">
                  Teknologi pembelajaran mesin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
