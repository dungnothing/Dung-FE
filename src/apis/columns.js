import axiosInstance from './index'

export const createNewColumnAPI = async (newColumnData) => {
  const response = await axiosInstance.post('/v1/columns', newColumnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axiosInstance.put(`/v1/columns/${columnId}`, updateData)
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId, boardId) => {
  const response = await axiosInstance.delete(`/v1/columns/${columnId}`, {
    data: { boardId }
  })
  return response.data
}
