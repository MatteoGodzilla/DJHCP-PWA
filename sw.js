const cacheName = "app-cache"
const cacheFiles = [
    "./index.html",
    "./manifest.webmanifest",
    "./src/main.js",
    "./src/darkly-theme.css",
    "./src/styles.css",
    "./src/icons/icon-72x72.png",
    "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js",
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
]

self.addEventListener("install",async ev =>{
    const cache = await caches.open(cacheName)
    cache.addAll(cacheFiles)
    console.log("Installed service Worker", ev)
})

self.addEventListener("activate",ev=>{
    console.log("Activated Service Worker", ev)
})

self.addEventListener("fetch", req =>{
    req.respondWith(
        caches.match(req).then(response => response || fetch(req.request))
    )
})