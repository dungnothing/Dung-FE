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

const refreshAccessToken = async () => {
  try {
    const refreshToken = getCookie('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    const response = await axios.post(`${API_ROOT}/v1/users/refreshToken`, { refreshToken })
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
