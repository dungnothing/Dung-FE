import axiosInstance from './index'

export const getSubcriptionAPI = async () => {
  const response = await axiosInstance.get('/v1/subscriptions')
  return response.data
}

export const createSubcriptionAPI = async (data) => {
  const response = await axiosInstance.post('/v1/subscriptions', data)
  return response.data
}
