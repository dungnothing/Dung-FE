import axiosInstance from './index'

// Cards
export const createNewCardAPI = async (newCardData) => {
  const response = await axiosInstance.post('/v1/cards', newCardData)
  return response.data
}

export const getDetailCardAPI = async (cardId) => {
  const response = await axiosInstance.get(`/v1/cards/${cardId}`)
  return response.data
}

export const updateCardAPI = async (cardId, updateData) => {
  const response = await axiosInstance.put(`/v1/cards/${cardId}`, updateData)
  return response.data
}

export const updateCardBackgroundAPI = async (cardId, updateData) => {
  const response = await axiosInstance.put(`/v1/cards/${cardId}/updateCardBackground`, updateData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const updateCancelCardAPI = async (cardId, updateData) => {
  const response = await axiosInstance.put(`/v1/cards/${cardId}/cancel`, updateData)
  return response.data
}

export const getMemberAPI = async (cardId) => {
  const response = await axiosInstance.get(`/v1/cards/${cardId}/getMember`)
  return response.data
}

export const getCommentsAPI = async (cardId) => {
  const response = await axiosInstance.get(`/v1/comments/${cardId}`)
  return response.data
}

export const createCommentAPI = async (commentData) => {
  const response = await axiosInstance.post('/v1/comments', commentData)
  return response.data
}

export const uploadFileAPI = async (cardId, formData, file) => {
  const response = await axiosInstance.put(
    `/v1/cards/${cardId}/uploadFile`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    },
    file
  )
  return response.data
}

export const removeFileAPI = async (cardId, data) => {
  const response = await axiosInstance.put(`/v1/cards/${cardId}/removeFile`, data)
  return response.data
}

export const uploadDescriptionAPI = async (cardId, formData) => {
  const response = await axiosInstance.post(`/v1/cards/${cardId}/uploadDescription`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}
