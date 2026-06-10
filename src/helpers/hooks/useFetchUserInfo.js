// hooks/useFetchUserInfo.js
import { useEffect, useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setUserInfo, setStarBoards, setNotifications, setRecentBoards, logout } from '~/redux/features/comon'
import { getUserInfoAPI, logoutAPI } from '~/apis/auth'
import { getNotificationAPI } from '~/apis/notification'
import { reconnectSocket } from '~/sockets/socket'
import { initFcm, disableFcm } from '~/utils/fcm'
import { toast } from 'react-toastify'
import Cookie from 'js-cookie'
import { useNavigate } from 'react-router-dom'

const getCookie = (name) => Cookie.get(name)

export const useFetchUserInfo = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const refreshToken = getCookie('refreshToken')
  const hasFetched = useRef(false)

  const handleLogout = async () => {
    await disableFcm()
    const refreshToken = Cookie.get('refreshToken')
    if (refreshToken) {
      try {
        await logoutAPI(refreshToken)
      } catch {
        /* bỏ qua nếu BE lỗi */
      }
    }
    dispatch(logout())
    Cookie.remove('accessToken')
    Cookie.remove('refreshToken')
    navigate('/sign-in')
  }

  const fetchUserInfo = useCallback(async () => {
    if (!refreshToken) return
    try {
      const [userInfo, notifications] = await Promise.all([getUserInfoAPI(), getNotificationAPI()])

      dispatch(
        setUserInfo({
          ...userInfo,
          userId: userInfo._id
        })
      )
      dispatch(setStarBoards(userInfo.starBoards))
      dispatch(setRecentBoards(userInfo.recentBoards))
      dispatch(setNotifications(notifications))

      // Đảm bảo socket được kết nối lại với accessToken mới sau khi đăng nhập
      reconnectSocket()

      // Đăng ký FCM push (tự bỏ qua nếu chưa cấu hình Firebase hoặc user từ chối quyền)
      initFcm()
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error('Tài khoản không tồn tại')
        handleLogout()
      } else if (err.response?.status === 401) {
        toast.error('Phiên đăng nhập hết hạn')
        handleLogout()
      } else {
        toast.error('Lỗi tải dữ liệu người dùng')
      }
    }
  }, [refreshToken])

  useEffect(() => {
    // Chỉ fetch 1 lần khi component mount
    if (!hasFetched.current && refreshToken) {
      hasFetched.current = true
      fetchUserInfo()
    }
  }, [refreshToken, fetchUserInfo])

  return { fetchUserInfo }
}
