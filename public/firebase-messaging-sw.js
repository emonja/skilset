/*
  Our notification-click listener is registered before
  Firebase Messaging is imported.
*/

const SW_VERSION = "SW-02";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", (event) => {
  /*
    Prevent Firebase's later listener from also handling
    this notification tap.
  */

  event.stopImmediatePropagation();
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
      const windows =
        await self.clients.matchAll({
          type: "window",
          includeUncontrolled: true
        });

      for (const windowClient of windows) {
        if ("navigate" in windowClient) {
          await windowClient.navigate(receiverUrl.href);
          return windowClient.focus();
        }
      }

      return self.clients.openWindow(receiverUrl.href);
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

  /*
    Notification payloads may be displayed automatically.
    We create notifications only for data-only messages.
  */

  if (payload.notification) {
    return;
  }

  const signal =
    payload.data?.signal ||
    payload.data?.body ||
    "Esteban has been remotely addressed.";

  return self.registration.showNotification(
    `${payload.data?.title || "SKILSET"} / ${SW_VERSION}`,
    {
      body: signal,

      data: {
        signal,
        path: "/practice/whisper.html"
      }
    }
  );
});