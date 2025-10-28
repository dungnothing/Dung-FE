import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
import store from '~/redux/store'
import { logout } from '~/redux/features/comon'
import getCookie from '~/utils/getcookie'

// Tạo instance axios với config mặc định
const axiosInstance = axios.create({
  baseURL: API_ROOT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

// Thêm interceptor để tự động gửi token trong header
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getCookie('accessToken')
    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Hàm refresh token
const refreshAccessToken = async () => {
  try {
    const refreshToken = getCookie('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    const response = await axios.post(`${API_ROOT}/v1/users/refreshToken`, { refreshToken: refreshToken })
    if (response.status === 200) {
      const newAccessToken = response.data.accessToken
      document.cookie = `accessToken=${newAccessToken}; path=/; max-age=${60 * 60}`
      return newAccessToken
    }
  } catch (error) {
    store.dispatch(logout())
    return null
  }
}

// Interceptor để refresh token nếu token hết hạn
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const newAccessToken = await refreshAccessToken()
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return axiosInstance(originalRequest)
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
