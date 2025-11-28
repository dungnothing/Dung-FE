// hooks/useFetchUserInfo.js
import { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setUserInfo, setStarBoards, setNotifications, setRecentBoards } from '~/redux/features/comon'
import { getUserInfoAPI } from '~/apis/auth'
import { getRecentBoardsAPI, getStarBoardAPI } from '~/apis/boards'
import { getNotificationAPI } from '~/apis/notification'
import { toast } from 'react-toastify'
import Cookie from 'js-cookie'
import { useNavigate } from 'react-router-dom'

const getCookie = (name) => Cookie.get(name)

export const useFetchUserInfo = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const refreshToken = getCookie('refreshToken')

  const logout = () => {
    Cookie.remove('accessToken')
    Cookie.remove('refreshToken')
    navigate('/sign-in')
  }

  const fetchUserInfo = useCallback(async () => {
    if (!refreshToken) return
    try {
      const [userInfo, starBoards, notifications, recentBoards] = await Promise.all([
        getUserInfoAPI(),
        getStarBoardAPI(),
        getNotificationAPI(),
        getRecentBoardsAPI()
      ])

      dispatch(setUserInfo(userInfo))
      dispatch(setStarBoards(starBoards))
      dispatch(setNotifications(notifications))
      dispatch(setRecentBoards(recentBoards))
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error('Tài khoản không tồn tại')
        logout()
      } else if (err.response?.status === 401) {
        toast.error('Phiên đăng nhập hết hạn')
        logout()
      } else {
        toast.error('Lỗi tải dữ liệu người dùng')
      }
    }
  }, [dispatch, refreshToken])

  useEffect(() => {
    fetchUserInfo()
  }, [fetchUserInfo])

  return { fetchUserInfo }
}
