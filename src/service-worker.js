/* eslint-disable no-restricted-globals */
import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
//add activate event
clientsClaim();
/* eslint-disable no-restricted-globals */
const manifest = self.__WB_MANIFEST;
const CACHE_NAMES = [
  "static-resources",
  "fonts-cache",
  "images-cache",
  "initial-static",
  "json-cache",
];
precacheAndRoute([]);
cleanupOutdatedCaches();
registerRoute(
  new NavigationRoute(new NetworkFirst({ cacheName: CACHE_NAMES[3] }), {
    allowlist: "[/^///$/]",
  })
);
//js, css
registerRoute(
  new RegExp(".(?:js|css)$"),
  new NetworkFirst({ cacheName: CACHE_NAMES[0] })
);
// Fonts
registerRoute(
  new RegExp(".(?:woff|woff2|ttf|eot)$"),
  new CacheFirst({ cacheName: CACHE_NAMES[1] })
);
// Images
registerRoute(
  new RegExp(".(?:png|ico|gif|jpg|jpeg|webp❘svg|mp4)$"),
  new StaleWhileRevalidate({ cacheName: CACHE_NAMES[2] })
);
// JSON
registerRoute(
  new RegExp(".(?:json)$"),
  new NetworkFirst({
    cacheName: CACHE_NAMES[4],
  })
);
/*eslint-disable-next-line no-restricted-globals*/

self.addEventListener("install", (event) => {
  console.log("Installing event", event);
  event.waitUntil(
    caches.open(CACHE_NAMES[3]).then((cache) => {
      console.log("Precaching App Shell");
      /* eslint-disable-next-line no-restricted-globals */
      cache.add(self.origin).then(() => {
        console.log("'Pre-cached NetworkFirst Start url");
      });
    })
  );
});
/* eslint-disable-next-line no-restricted-globals */
self.addEventListener("activate", function (event) {
  console.log("Activating Service Worker ...", event);
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map(function (key) {
          if (!CACHE_NAMES.includes(key)) {
            console.log("Removing old cache.", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  /* eslint-disable-next-line no-restricted-globals */
  return self.clients.claim();
});
/* eslint-disable-next-line no-restricted-globals */
self.addEventListener("message", (event) => {
  if (event?.data?.type === "SKIP_WAITING") {
    /* eslint-disable-next-line no-restricted-globals */
    self.skipWaiting();
  }
});
