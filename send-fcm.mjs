import { readFile } from "node:fs/promises";

import {
  cert,
  initializeApp
} from "firebase-admin/app";

import {
  getMessaging
} from "firebase-admin/messaging";

const keyUrl =
  new URL(
    "./private/serviceAccountKey.json",
    import.meta.url
  );

const devicesUrl =
  new URL(
    "./private/devices.json",
    import.meta.url
  );

const serviceAccount =
  JSON.parse(
    await readFile(keyUrl, "utf8")
  );

initializeApp({
  credential: cert(serviceAccount)
});

const devices =
  JSON.parse(
    await readFile(devicesUrl, "utf8")
);

const [
  target,
  ...messageWords
] = process.argv.slice(2);

const token =
  devices[target] ?? target;

const signal =
  messageWords.join(" ").trim();

if (!token || !signal) {
  console.error(
    'Usage: node send-fcm.mjs "DEVICE_OR_TOKEN" "MESSAGE"'
  );

  process.exit(1);
}

const messageId =
  await getMessaging().send({
    token,

    /*
      Data-only payload:
      Firebase will not create the notification.
      Our service worker will.
    */

    data: {
      title: "WHISPER",
      body: signal,
      signal
    },

    webpush: {
      headers: {
        Urgency: "high"
      }
    }
  });

console.log("Signal transmitted.");
console.log("FCM message ID:", messageId);