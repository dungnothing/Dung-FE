import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
import store from '~/redux/store'
import { logout } from '~/redux/features/comon'
import Cookie from 'js-cookie'

const getCookie = (name) => Cookie.get(name)

const axiosInstance = axios.create({
  baseURL: API_ROOT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

let isRefreshing = false
let refreshTokenPromise = null

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
  (error) => Promise.reject(error)
)

// Hàm dùng chung để force logout hoàn toàn (cả FE lẫn BE)
const forceLogout = async () => {
  const refreshToken = getCookie('refreshToken')
  if (refreshToken) {
    try {
      await axios.post(`${API_ROOT}/v1/users/logout`, { refreshToken })
    } catch {
      // Bỏ qua lỗi BE, vẫn tiến hành clear FE
    }
  }
  store.dispatch(logout())
  Cookie.remove('accessToken')
  Cookie.remove('refreshToken')
}

const refreshAccessToken = async () => {
  try {
    const refreshToken = getCookie('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    const response = await axios.post(`${API_ROOT}/v1/users/refreshToken`, { refreshToken })
    if (response.status === 200) {
      const newAccessToken = response.data.accessToken
      // Dùng Cookie.set thay vì document.cookie để nhất quán
      Cookie.set('accessToken', newAccessToken, { expires: 1 / 24 }) // 1 giờ
      return newAccessToken
    }
  } catch {
    // refreshToken không hợp lệ / hết hạn / đã bị thu hồi → force logout
    await forceLogout()
    return null
  }
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (!isRefreshing) {
        isRefreshing = true
        refreshTokenPromise = refreshAccessToken()
          .then((newAccessToken) => {
            isRefreshing = false
            refreshTokenPromise = null
            return newAccessToken
          })
          .catch((err) => {
            isRefreshing = false
            refreshTokenPromise = null
            throw err
          })
      }

      try {
        const newAccessToken = await refreshTokenPromise
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return axiosInstance(originalRequest)
        }
        return Promise.reject(error)
      } catch (err) {
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
