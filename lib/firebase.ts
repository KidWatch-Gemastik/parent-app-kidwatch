import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

let app;
if (!getApps().length) app = initializeApp(firebaseConfig);
else app = getApps()[0];

let messaging: ReturnType<typeof getMessaging> | null = null;

// Init messaging hanya di client
if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

export const getDeviceToken = async (): Promise<string | null> => {
  if (!messaging) return null;

  try {
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
    });
    return currentToken || null;
  } catch (error) {
    console.error("❌ Gagal ambil token:", error);
    return null;
  }
};

export const onMessageListener = (callback: (payload: any) => void) => {
  if (!messaging) return () => {};
  const unsubscribe = onMessage(messaging, callback);
  return () => unsubscribe();
};
