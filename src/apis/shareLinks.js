import axiosInstance from './index'

export const getShareLinkAPI = async (boardId) => {
  const response = await axiosInstance.get(`/v1/shareLinks/${boardId}`)
  return response.data
}

export const enableShareLinkAPI = async (boardId, expiresAt = null) => {
  const response = await axiosInstance.post(`/v1/shareLinks/${boardId}`, { expiresAt })
  return response.data
}

export const updateExpirationAPI = async (boardId, expiresAt) => {
  const response = await axiosInstance.put(`/v1/shareLinks/${boardId}`, { expiresAt })
  return response.data
}

export const disableShareLinkAPI = async (boardId) => {
  const response = await axiosInstance.delete(`/v1/shareLinks/${boardId}`)
  return response.data
}

export const accessViaShareLinkAPI = async (token) => {
  const response = await axiosInstance.get(`/v1/shareLinks/access/${token}`)
  return response.data
}
