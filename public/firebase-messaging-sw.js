/* eslint-disable no-undef */
// Service worker nhận FCM push khi tab/app đang đóng hoặc không focus.
// Chạy độc lập với bundle Vite nên phải dùng compat build qua importScripts
// (phiên bản CDN không cần trùng với version firebase trong package.json).
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js')

// ===================================================================
// ĐIỀN KEY FIREBASE TẠI ĐÂY - cùng bộ config với fe/src/utils/firebaseConfig.js
// ===================================================================
firebase.initializeApp({
  apiKey: 'AIzaSyA-GEhn7Mta-Y9Yi5JtqG4Rc2mic04RU4A',
  authDomain: 'wednesday-8c504.firebaseapp.com',
  projectId: 'wednesday-8c504',
  storageBucket: 'wednesday-8c504.firebasestorage.app',
  messagingSenderId: '244131214320',
  appId: '1:244131214320:web:dfdbf2ac7a1ead6ad5e335',
  measurementId: 'G-4CSW5F5B91'
})

const messaging = firebase.messaging()

// BE gửi data-only message nên tự hiển thị notification ở đây
messaging.onBackgroundMessage((payload) => {
  console.log('[sw] onBackgroundMessage received:', payload)
  const { title, body, boardId } = payload.data || {}
  self.registration.showNotification(title || 'Wednesday Light', {
    body: body || '',
    icon: '/W.svg',
    data: { boardId }
  })
})

// Log mọi push event để debug (notification message thì handler trên không chạy, nhưng event này vẫn bắn)
self.addEventListener('push', (event) => {
  console.log('[sw] push event raw:', event.data?.text?.())
})

// Click vào notification: focus tab đang mở hoặc mở tab mới tới board liên quan
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const boardId = event.notification.data?.boardId
  const url = boardId ? `/boards/${boardId}` : '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      return clients.openWindow(url)
    })
  )
})
