import axiosInstance from './index'

export const getNotificationAPI = async () => {
  const response = await axiosInstance.get('/v1/notifications')
  return response.data
}

export const markAllAsReadAPI = async () => {
  const response = await axiosInstance.put('/v1/notifications/mark-all')
  return response.data
}

export const markAsReadAPI = async (id) => {
  const response = await axiosInstance.put(`/v1/notifications/mark/${id}`)
  return response.data
}

export const registerFcmTokenAPI = async (fcmToken) => {
  const response = await axiosInstance.post('/v1/notifications/fcm-token', { fcmToken })
  return response.data
}

export const removeFcmTokenAPI = async (fcmToken) => {
  const response = await axiosInstance.delete('/v1/notifications/fcm-token', { data: { fcmToken } })
  return response.data
}
