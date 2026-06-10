// ===================================================================
// ĐIỀN KEY FIREBASE TẠI ĐÂY (Firebase Console -> Project settings -> General -> Your apps -> Web app)
// Lưu ý: config web của Firebase là public, commit vào repo được, không phải secret.
// Sau khi điền xong, NHỚ điền cùng bộ config vào fe/public/firebase-messaging-sw.js
// ===================================================================
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyA-GEhn7Mta-Y9Yi5JtqG4Rc2mic04RU4A',
  authDomain: 'wednesday-8c504.firebaseapp.com',
  projectId: 'wednesday-8c504',
  storageBucket: 'wednesday-8c504.firebasestorage.app',
  messagingSenderId: '244131214320',
  appId: '1:244131214320:web:dfdbf2ac7a1ead6ad5e335',
  measurementId: 'G-4CSW5F5B91'
}

// Firebase Console -> Project settings -> Cloud Messaging -> Web Push certificates -> Key pair
export const FIREBASE_VAPID_KEY =
  'BI9BNYxlZxNcSS0xDdo8N3BGAXGSTspD_WsPRnh_x5g3uk9SnwOJHCKSwkNnSX-zZ6-e7cjQcrZqf0XkROZo9pc'

// Chưa điền key thì toàn bộ tính năng FCM tự tắt, app vẫn chạy bình thường
export const isFirebaseConfigured = () => Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_VAPID_KEY)
