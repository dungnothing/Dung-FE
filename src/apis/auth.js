import axiosInstance from './index'

export const getGoogleAuthUrlAPI = async () => {
  const response = await axiosInstance.get('/v1/users/getGoogleAuthUrl')
  return response.data
}

export const loginWithGoogleAPI = async (code) => {
  const response = await axiosInstance.get(`/v1/users/googleCallback?code=${code}`)
  return response.data
}

export const signUpAPI = async (signUpData) => {
  const response = await axiosInstance.post('/v1/users/register', signUpData)
  return response.data
}

export const signInAPI = async (signInData) => {
  const response = await axiosInstance.post('/v1/users/login', signInData)
  return response.data
}

export const getUserInfoAPI = async () => {
  const response = await axiosInstance.get('/v1/users/getUserInfo')
  return response.data
}

export const updateInfoAPI = async (updateData) => {
  const response = await axiosInstance.put('/v1/users/updateInfo', updateData)
  return response.data
}

export const updatePasswordAPI = async (updateData) => {
  const response = await axiosInstance.put('/v1/users/updatePassword', updateData)
  return response.data
}

export const updateVipAPI = async (updateData) => {
  const response = await axiosInstance.put('/v1/users/upgradeVip', updateData)
  return response.data
}

export const updateAvatarAPI = async (updateData) => {
  const response = await axiosInstance.put('/v1/users/updateAvatar', updateData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const deleteAccountAPI = async () => {
  const response = await axiosInstance.delete('/v1/users/deleteAccount')
  return response.data
}

// PassWord
export const forgotPasswordAPI = async (email) => {
  const response = await axiosInstance.post('/v1/users/forgotPassword', email)
  return response.data
}

export const verifyOtpAPI = async (data) => {
  const response = await axiosInstance.post('/v1/users/verifyOtp', data)
  return response.data
}

export const resetPasswordAPI = async (data) => {
  const response = await axiosInstance.post('/v1/users/resetPassword', data)
  return response.data
}
