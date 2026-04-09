const CACHE_NAME = 'hmc-app-v1';

self.addEventListener('install', (event) => {
    console.log('Service Worker instalado.');
});

// Agora o fetch tem uma instrução válida: apenas seguir em frente
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request).catch(() => {
        // Se a internet cair, ele não faz nada por enquanto, 
        // mas o navegador para de reclamar do aviso.
    }));
});
