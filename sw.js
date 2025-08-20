const CACHE_NAME = "cache-v8";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./game.html",
  "./mini-game.html",
  "./background-game.mp3",
  "./main-theme.mp3",
  "./box-bg.png",
  "./coin.svg",
  "./discord-logo.png",
  "./farmer-m.png",
  "./game.css",
  "./green-arrow.png",
  "./index.css",
  "./index.js",
  "./logo.png",
  "./mask1.png",
  "./mask2.png",
  "./mask3.png",
  "./mask4.png",
  "./mini-game.css",
  "./obstacle1.png",
  "./obstacle2.png",
  "./online.svg",
  "./point1.png",
  "./point2.png",
  "./powerup1.png",
  "./prestige.svg",
  "./prestige_ui.svg",
  "./settings.svg",
  "./shader.js",
  "./tap.mp3",
  "./tap.svg",
  "./tiktok-logo.png",
  "./truck.svg",
  "./upgrades.svg",
  "./window-bg.png",
  "./work.svg",
  "./workshop.svg",
];

// Install: statische Assets cachen
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// Activate: alte Caches löschen
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// Fetch: dynamisches Caching + Fallbacks
self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  // Statische Assets direkt aus Cache bedienen
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).catch(() => cached))
    );
    return;
  }

  // Favicon oder andere "leere" Requests abfangen
  if (url.pathname === "/favicon.ico") {
    event.respondWith(new Response("", {status: 200, statusText: "OK"}));
    return;
  }

  // Dynamisches Caching für HTML, JS, CSS, SVG
  if (req.destination === "document" || req.destination === "script" || req.destination === "style" || req.destination === "image") {
    event.respondWith(
      fetch(req)
        .then(resp => {
          if (!resp.ok || resp.type === "opaque") return resp;
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return resp;
        })
        .catch(() =>
          caches.match(req) ||
          new Response("Offline", {status: 200, statusText: "OK"})
        )
    );
    return;
  }

  // Alles andere normal weiterleiten
  event.respondWith(fetch(req).catch(() => caches.match(req)));
});
