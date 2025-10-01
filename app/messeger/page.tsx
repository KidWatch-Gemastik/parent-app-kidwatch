"use client";

import { useState, useEffect } from "react";
import { getDeviceToken, onMessageListener } from "@/lib/firebase";
import { analyzeText } from "@/utils/nlp";

export default function ParentDashboard() {
    const [deviceToken, setDeviceToken] = useState<string | undefined>(undefined);
    const [permissionStatus, setPermissionStatus] = useState<string>("default");
    const [textInput, setTextInput] = useState<string>("");
    const [parentEmail, setParentEmail] = useState<string>("");
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
            const data = await analyzeText(textInput, parentEmail, deviceToken);
            setResponseMessage(JSON.stringify(data, null, 2));
        } catch (err) {
            console.error("API Error:", err);
            setResponseMessage("❌ Terjadi error saat mengirim request");
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h1>Parent Dashboard</h1>

            {permissionStatus !== "granted" && <p>Silakan aktifkan notifikasi</p>}
            {deviceToken && (
                <p>
                    <strong>Device Token:</strong> {deviceToken}
                </p>
            )}

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
                <pre
                    style={{
                        marginTop: "1rem",
                        background: "#000",
                        color: "#0f0",
                        padding: "1rem",
                        borderRadius: "6px",
                    }}
                >
                    {responseMessage}
                </pre>
            )}
        </div>
    );
}
