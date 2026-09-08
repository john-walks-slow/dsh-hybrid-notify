// src/index.ts
var name = "notify";
var inject = ["webServer"];
var SW_SOURCE = `
self.addEventListener("install", (event) => { self.skipWaiting(); });
self.addEventListener("activate", (event) => { event.waitUntil(self.clients.claim()); });
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const sessionId = data.sessionId;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.postMessage({ type: "notify:focus-session", sessionId });
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow("/");
    })
  );
});
`;
function apply(ctx) {
  ctx.effect(
    () => ctx.webServer.register({
      kind: "exact",
      path: "/plugins/dsh-notify/sw.js",
      handler: (_req, res) => {
        res.writeHead(200, {
          "content-type": "application/javascript; charset=utf-8",
          "cache-control": "no-cache"
        });
        res.end(SW_SOURCE);
      }
    }),
    "notify: sw route"
  );
}
export {
  apply,
  inject,
  name
};
