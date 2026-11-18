// Lab Alert service worker: shows the push notification (with sound/vibration) even when the app is closed.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { title: "Lab complete", body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || "Lab complete", {
    body: d.body || "", tag: d.tag || "lab", renotify: true, requireInteraction: true,
    icon: "icon.png", badge: "icon.png", vibrate: [300, 120, 300, 120, 600], silent: false,
  }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of all) { if ("focus" in c) return c.focus(); }
    return self.clients.openWindow("./");
  })());
});
