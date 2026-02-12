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
