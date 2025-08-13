const CACHE_NAME = 'meal-tracker-v1';
const RUNTIME_CACHE = 'runtime-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png'
];

// Enhanced notification storage with duplicate prevention
let scheduledNotifications = new Map();
let muteUntil = 0; // timestamp in ms
let lastNotificationTime = 0;
let notificationHistory = new Map(); // Track recent notifications to prevent duplicates

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch event - runtime caching with offline support
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isSupabase = url.origin.includes('supabase.co');

  // Cache Supabase GET requests (data APIs)
  if (isSupabase) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        try {
          const res = await fetch(req);
          cache.put(req, res.clone());
          return res;
        } catch (err) {
          const cached = await cache.match(req);
          if (cached) return cached;
          throw err;
        }
      })
    );
    return;
  }

  // Handle navigation requests: fallback to cached shell when offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('/'))
    );
    return;
  }

  // Same-origin assets: cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, copy));
        return res;
      });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Handle messages from the main thread with enhanced duplicate prevention
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'SCHEDULE_NOTIFICATION':
      showNotificationWithDuplicateCheck(payload.title, payload.body, payload.tag);
      break;

    case 'CLEAR_NOTIFICATIONS':
      // Clear all scheduled notifications and history
      scheduledNotifications.forEach(timeoutId => clearTimeout(timeoutId));
      scheduledNotifications.clear();
      notificationHistory.clear();
      break;

    case 'SET_MUTE_UNTIL':
      muteUntil = (payload && payload.muteUntil) || 0;
      break;

    case 'PING':
      // Connection test - respond with pong
      event.ports[0]?.postMessage({ type: 'PONG', timestamp: Date.now() });
      break;
  }
});

// Enhanced notification with duplicate prevention and better UX
function showNotificationWithDuplicateCheck(title, body, tag) {
  // Respect mute window
  if (muteUntil && Date.now() < muteUntil) return;

  const now = Date.now();
  const duplicateThreshold = 60000; // 1 minute

  // Check for recent duplicate
  const historyKey = `${title}-${body}`;
  const lastShown = notificationHistory.get(historyKey);
  
  if (lastShown && (now - lastShown) < duplicateThreshold) {
    console.log('Duplicate notification prevented:', title);
    return;
  }

  // Prevent notifications too close together
  if (now - lastNotificationTime < 5000) { // 5 seconds minimum gap
    console.log('Rate limited notification:', title);
    return;
  }

  // Update tracking
  notificationHistory.set(historyKey, now);
  lastNotificationTime = now;

  // Clean old history (keep only last hour)
  const oneHourAgo = now - 3600000;
  for (const [key, time] of notificationHistory) {
    if (time < oneHourAgo) {
      notificationHistory.delete(key);
    }
  }

  const options = {
    body,
    tag,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    vibrate: [200, 100, 200], // Enhanced vibration pattern
    data: {
      timestamp: now,
      url: '/',
      type: getNotificationType(title)
    },
    actions: [
      {
        action: 'view',
        title: '👀 Ver App',
        icon: '/pwa-192x192.png'
      },
      {
        action: 'snooze',
        title: '😴 Soneca 10min',
        icon: '/pwa-192x192.png'
      }
    ],
    requireInteraction: false,
    silent: false
  };

  self.registration.showNotification(title, options);
}

// Legacy function for compatibility
function showNotification(title, body, tag) {
  showNotificationWithDuplicateCheck(title, body, tag);
}

// Helper to determine notification type
function getNotificationType(title) {
  if (title.includes('🍽️') || title.includes('Refeição')) return 'meal';
  if (title.includes('💧') || title.includes('Hidrat')) return 'hydration';
  if (title.includes('📋') || title.includes('Planej')) return 'planning';
  if (title.includes('💡') || title.includes('Dica')) return 'tip';
  return 'general';
}

// Enhanced notification click handling with actions
self.addEventListener('notificationclick', (event) => {
  const action = event.action;
  const notification = event.notification;
  
  notification.close();

  if (action === 'snooze') {
    // Set snooze (10 minutes)
    muteUntil = Date.now() + (10 * 60 * 1000);
    
    // Show feedback notification
    setTimeout(() => {
      self.registration.showNotification('😴 Soneca ativada', {
        body: 'Notificações pausadas por 10 minutos',
        tag: 'snooze-feedback',
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        silent: true,
        requireInteraction: false
      });
    }, 500);
    
    return;
  }

  // Default action or 'view' action - open/focus app
  const urlToOpen = new URL('/', self.location.origin).href;

  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((windowClients) => {
    // Check if there's already a window/tab open with the target URL
    for (let i = 0; i < windowClients.length; i++) {
      const client = windowClients[i];
      if (client.url === urlToOpen && 'focus' in client) {
        return client.focus();
      }
    }

    // If no window/tab is already open, open a new one
    if (clients.openWindow) {
      return clients.openWindow(urlToOpen);
    }
  }).then((windowClient) => {
    // Send message to client about notification interaction
    if (windowClient) {
      windowClient.postMessage({
        type: 'NOTIFICATION_CLICKED',
        data: {
          title: notification.title,
          body: notification.body,
          action: action || 'default',
          timestamp: Date.now()
        }
      });
    }
  });

  event.waitUntil(promiseChain);
});