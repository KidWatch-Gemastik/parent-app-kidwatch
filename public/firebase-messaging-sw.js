importScripts("https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyBYfu7xnJsUPUDN1T-q8BTwJLBiwQ7vxck",
    authDomain: "kiddy-go.firebaseapp.com",
    projectId: "kiddy-go",
    storageBucket: "kiddy-go.firebasestorage.app",
    messagingSenderId: "513963830561",
    appId: "1:513963830561:web:e833878eeb4368a2fd2260",
    measurementId: "G-X068SP7LHL"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log("[firebase-messaging-sw.js] Pesan diterima di background:", payload);
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
    });
});
