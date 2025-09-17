"use client";

import { useState, useEffect } from "react";
import { getDeviceToken, onMessageListener } from "@/lib/firebase";

export default function ParentDashboard() {
    const [deviceToken, setDeviceToken] = useState<string | null>(null);
    const [permissionStatus, setPermissionStatus] = useState<string>("default");
    const [textInput, setTextInput] = useState<string>(""); // input teks user
    const [parentEmail, setParentEmail] = useState<string>(""); // optional email
    const [responseMessage, setResponseMessage] = useState<string>("");

    useEffect(() => {
        const initNotifications = async () => {
            const permission = await Notification.requestPermission();
            setPermissionStatus(permission);

            if (permission === "granted") {
                const token = await getDeviceToken();
                if (token) setDeviceToken(token);
            }
        };
        initNotifications();

        const unsubscribe = onMessageListener((payload) => {
            if (payload?.notification) {
                alert(`Notifikasi: ${payload.notification.title} - ${payload.notification.body}`);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSend = async () => {
        if (!textInput) {
            alert("❌ Masukkan teks dulu");
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/analyze-text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: textInput,
                    parent_email: parentEmail || undefined,
                    parent_token: deviceToken || undefined,
                }),
            });

            const data = await res.json();
            setResponseMessage(JSON.stringify(data, null, 2)); // tampilkan response dari BE
        } catch (err) {
            console.error(err);
            setResponseMessage("❌ Terjadi error saat mengirim request");
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h1>Parent Dashboard</h1>

            {permissionStatus !== "granted" && <p>Silakan aktifkan notifikasi</p>}
            {deviceToken && <p><strong>Device Token:</strong> {deviceToken}</p>}

            <div style={{ marginTop: "1rem" }}>
                <input
                    type="text"
                    placeholder="Masukkan teks untuk dianalisis"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    style={{ width: "300px", display: "block", marginBottom: "0.5rem" }}
                />
                <input
                    type="email"
                    placeholder="Email orang tua (opsional)"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    style={{ width: "300px", display: "block", marginBottom: "0.5rem" }}
                />
                <button onClick={handleSend}>Kirim ke Backend</button>
            </div>

            {responseMessage && (
                <pre style={{ marginTop: "1rem", background: "#000", padding: "1rem" }}>
                    {responseMessage}
                </pre>
            )}
        </div>
    );
}
