import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, deleteToken, isSupported } from 'firebase/messaging'
import { FIREBASE_CONFIG, FIREBASE_VAPID_KEY, isFirebaseConfigured } from './firebaseConfig'
import { registerFcmTokenAPI, removeFcmTokenAPI } from '../apis/notification'

let messagingInstance = null

const getMessagingInstance = async () => {
  if (!isFirebaseConfigured()) return null
  if (!(await isSupported())) return null // Safari cũ / trình duyệt không hỗ trợ Push API
  if (!messagingInstance) {
    const app = initializeApp(FIREBASE_CONFIG)
    messagingInstance = getMessaging(app)
  }
  return messagingInstance
}

// Gọi sau khi đăng nhập thành công: xin quyền, lấy device token và đăng ký với BE
export const initFcm = async () => {
  try {
    const messaging = await getMessagingInstance()
    if (!messaging) return

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
    const fcmToken = await getToken(messaging, {
      vapidKey: FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration
    })
    if (fcmToken) {
      await registerFcmTokenAPI(fcmToken)
    }
  } catch (error) {
    // FCM lỗi không được ảnh hưởng tới luồng đăng nhập
    // eslint-disable-next-line no-console
    console.error('[fcm] Không đăng ký được push notification:', error)
  }
}

// Gọi khi logout: hủy token để device này không nhận noti của user cũ nữa
export const disableFcm = async () => {
  try {
    const messaging = await getMessagingInstance()
    if (!messaging || Notification.permission !== 'granted') return

    const fcmToken = await getToken(messaging, { vapidKey: FIREBASE_VAPID_KEY })
    if (fcmToken) {
      await removeFcmTokenAPI(fcmToken).catch(() => {})
      await deleteToken(messaging)
    }
  } catch {
    // Bỏ qua, không chặn luồng logout
  }
}
