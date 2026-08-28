importScripts(
  "https://www.gstatic.com/firebasejs/12.18.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.18.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  // Copy the exact firebaseConfig values from fcm-01.html
  apiKey: "AIzaSyBCD7hYTGcuwd-d9t8eCfwvNcGFbbwbg5A",
  authDomain: "skilseting.firebaseapp.com",
  projectId: "skilseting",
  storageBucket: "skilseting.firebasestorage.app",
  messagingSenderId: "323745949558",
  appId: "1:323745949558:web:bfda4c5b62d79d7dde7c57"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Background message:",
    payload
  );

  // Notification messages sent from Firebase Console are
  // displayed automatically. This handles data-only messages.
  if (!payload.notification) {
    self.registration.showNotification(
      payload.data?.title || "SKILSET",
      {
        body:
          payload.data?.body ||
          "Esteban has been remotely addressed.",
        icon: "/icon-192.png"
      }
    );
  }
});