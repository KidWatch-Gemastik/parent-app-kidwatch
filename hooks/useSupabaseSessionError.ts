"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

type ShowAlertFn = (type: "success" | "error", message: string) => void

export function useSupabaseSessionError(showAlert: ShowAlertFn) {
    const router = useRouter()

    useEffect(() => {
        if (typeof window === "undefined") return

        const hashParams = new URLSearchParams(window.location.hash.slice(1))
        const error = hashParams.get("error")
        const errorCode = hashParams.get("error_code")
        const errorDescription = hashParams.get("error_description")

        if (error && errorCode === "otp_expired") {
            showAlert(
                "error",
                "Link login atau OTP Anda telah kedaluwarsa. Silakan kirim ulang untuk mendapatkan yang baru.",
            )

            window.history.replaceState(null, "", window.location.pathname)

            // router.push("/login")
        }
    }, [showAlert, router])
}
