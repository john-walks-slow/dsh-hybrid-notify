/**
 * Host half: registers a route to serve the Service Worker script.
 *
 * SW cannot be registered from a Blob URL (spec requires http/https scheme).
 * So the host serves it at /plugins/dsh-notify/sw.js.
 *
 * @module dsh-notify
 */

const name = "notify";
const inject = ["webServer"];

/** Service Worker source — served at /plugins/dsh-notify/sw.js */
const SW_SOURCE = `
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

function apply(ctx: any) {
	ctx.effect(() =>
		ctx.webServer.register({
			kind: "exact",
			path: "/plugins/dsh-notify/sw.js",
			handler: (_req: any, res: any) => {
				res.writeHead(200, {
					"content-type": "application/javascript; charset=utf-8",
					"cache-control": "no-cache",
				});
				res.end(SW_SOURCE);
			},
		}),
		"notify: sw route",
	);
}

export { apply, inject, name };
