import axiosInstance from './index'

export const getAllAccessibleBoardsAPI = async () => {
  const response = await axiosInstance.get('/v1/boards/accessible')
  return response.data
}

export const getStarBoardAPI = async () => {
  const response = await axiosInstance.get('/v1/users/starBoard')
  return response.data
}

export const fetchBoardDetailsAPI = async (boardId, params) => {
  const response = await axiosInstance.get(`/v1/boards/content/${boardId}`, { params })
  return response.data
}

export const createNewBoardAPI = async (boardData) => {
  const response = await axiosInstance.post('/v1/boards/content', boardData)
  return response.data
}

export const deleteBoardAPI = async (boardId) => {
  const response = await axiosInstance.delete(`/v1/boards/content/${boardId}`)
  return response.data
}

export const deleteManyBoardAPI = async () => {
  const response = await axiosInstance.delete('/v1/boards/delete-board')
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axiosInstance.put(`/v1/boards/content/${boardId}`, updateData)
  return response.data
}

// inviteData: { email, role? } — role: OWNER khong duoc phep, ADMIN chi Owner moi duoc
export const inviteMemberAPI = async (boardId, inviteData) => {
  const response = await axiosInstance.post(`/v1/boards/${boardId}/members`, inviteData)
  return response.data
}

// Backward compat: cac component cu dang goi addMemberToBoardAPI
export const addMemberToBoardAPI = inviteMemberAPI

export const kickMemberAPI = async (boardId, memberId) => {
  const response = await axiosInstance.delete(`/v1/boards/${boardId}/members/${memberId}`)
  return response.data
}
export const removeMemberFromBoardAPI = kickMemberAPI

export const changeMemberRoleAPI = async (boardId, memberId, newRole) => {
  const response = await axiosInstance.put(`/v1/boards/${boardId}/members/${memberId}/role`, { newRole })
  return response.data
}

export const leaveBoardAPI = async (boardId) => {
  const response = await axiosInstance.post(`/v1/boards/${boardId}/leave`)
  return response.data
}

export const getMyBoardPermissionsAPI = async (boardId) => {
  const response = await axiosInstance.get(`/v1/boards/${boardId}/my-permissions`)
  return response.data
}

export const searchUserAPI = async (query) => {
  const response = await axiosInstance.get(`/v1/users/searchUser?query=${query}`)
  return response.data
}

export const getAllUserInBoardAPI = async (boardId) => {
  const response = await axiosInstance.get(`/v1/boards/${boardId}/members`)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axiosInstance.put('/v1/boards/supports/moving_card', updateData)
  return response.data
}

export const getListBackgroundAPI = async () => {
  const response = await axiosInstance.get('/v1/boards/backgrounds')
  return response.data
}

export const getTemplateAPI = async () => {
  const response = await axiosInstance.get('/v2/templates')
  return response.data
}

export const cloneTemplateAPI = async (cloneData) => {
  const response = await axiosInstance.post('/v2/templates/clone', cloneData)
  return response.data
}

export const addStarBoardAPI = async (boardId) => {
  const response = await axiosInstance.put(`/v1/users/starBoard/${boardId}`)
  return response.data
}

export const removeStarBoardAPI = async (boardId) => {
  const response = await axiosInstance.delete(`/v1/users/starBoard/${boardId}`)
  return response.data
}

export const getRecentBoardsAPI = async () => {
  const response = await axiosInstance.get('/v1/users/recentBoards')
  return response.data
}

export const addRecentBoardAPI = async (boardId) => {
  const response = await axiosInstance.put(`/v1/users/recentBoards/${boardId}`)
  return response.data
}

export const transferOwnershipAPI = async (boardId, targetUserId) => {
  const response = await axiosInstance.put(`/v1/boards/${boardId}/transferOwnership`, { targetUserId })
  return response.data
}
// Backward compat
export const changeAdminAPI = async (boardId, memberId) => {
  return transferOwnershipAPI(boardId, memberId)
}

export const findUserInBoardAPI = async (boardId, query) => {
  const response = await axiosInstance.get(`/v1/boards/findUserInBoard/${boardId}?term=${query}`)
  return response.data
}
