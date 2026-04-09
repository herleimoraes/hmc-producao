// sw.js
const CACHE_NAME = 'hmc-app-v1';

// Apenas um listener de instalação básico para passar na verificação de PWA
self.addEventListener('install', (event) => {
    console.log('Service Worker instalado.');
});

self.addEventListener('fetch', (event) => {
    // Aqui no futuro podemos configurar para o app funcionar sem internet
});
