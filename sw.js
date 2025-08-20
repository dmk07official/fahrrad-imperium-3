const CACHE_NAME = "cache-v3";
const ASSETS = [
  "./", 
  "./background-game.mp3",
  "./box-bg.png",
  "./coin.svg",
  "./discord-logo.png",
  "./farmer-m.png",
  // ./game-server.js NICHT cachen, immer live!
  "./game.css",
  "./game.html",
  "./game.js",
  "./global-css-variables.css",
  "./green-arrow.png",
  "./index.css",
  "./index.html",
  "./index.js",
  "./logo.png",
  "./main-theme.mp3",
  "./mask1.png",
  "./mask2.png",
  "./mask3.png",
  "./mask4.png",
  "./mini-game.css",
  "./mini-game.html",
  "./mini-game.js",
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

// Service Worker installieren & Dateien cachen (mit Error-Logging)
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const asset of ASSETS) {
        try {
          await cache.add(asset);
          console.log("Gecacht:", asset);
        } catch (e) {
          console.error("Konnte nicht cachen:", asset, e);
        }
      }
    })
  );
});

// Alte Caches löschen wenn neue Version da
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Bei Anfragen erst Cache, dann Netz (mit ignoreSearch)
self.addEventListener("fetch", event => {
  if (event.request.url.includes("/game-server.js")) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(response => {
      return response || fetch(event.request);
    })
  );
});
