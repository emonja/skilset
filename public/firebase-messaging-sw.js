/*
  This listener must be registered before Firebase Messaging
  is imported, so our notification-tap behavior wins.
*/

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const signal =
    event.notification.data?.signal ||
    event.notification.body ||
    event.notification.title ||
    "EMPTY SIGNAL";

  const receiverUrl =
    new URL(
      event.notification.data?.path ||
      "/practice/whisper.html",
      self.location.origin
    );

  receiverUrl.searchParams.set("signal", signal);

  event.waitUntil(
    (async () => {
      const windows = await clients.matchAll({
        type: "window",
        includeUncontrolled: true
      });

      for (const windowClient of windows) {
        if ("navigate" in windowClient) {
          await windowClient.navigate(receiverUrl.href);
          return windowClient.focus();
        }
      }

      return clients.openWindow(receiverUrl.href);
    })()
  );
});

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

        data: {
          signal:
            payload.data?.signal ||
            payload.data?.body ||
            "EMPTY SIGNAL",

          path: "/practice/whisper.html"
        }
      }
    );
  }
});