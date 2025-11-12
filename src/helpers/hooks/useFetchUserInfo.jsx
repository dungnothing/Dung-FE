// hooks/useFetchUserInfo.js
import { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setUserInfo, setStarBoards, setNotifications, setRecentBoards } from '~/redux/features/comon'
import { getUserInfoAPI } from '~/apis/auth'
import { getRecentBoardsAPI, getStarBoardAPI } from '~/apis/boards'
import { getNotificationAPI } from '~/apis/notification'
import { toast } from 'react-toastify'
import Cookie from 'js-cookie'

const getCookie = (name) => Cookie.get(name)

export const useFetchUserInfo = () => {
  const dispatch = useDispatch()
  const refreshToken = getCookie('refreshToken')

  const fetchUserInfo = useCallback(async () => {
    if (!refreshToken) return
    try {
      const [userResult, starBoardResult, notificationResult, recentBoardResult] = await Promise.allSettled([
        getUserInfoAPI(),
        getStarBoardAPI(),
        getNotificationAPI(),
        getRecentBoardsAPI()
      ])

      if (userResult.status === 'fulfilled') {
        dispatch(setUserInfo(userResult.value))
      }

      if (starBoardResult.status === 'fulfilled') {
        dispatch(setStarBoards(starBoardResult.value))
      }

      if (notificationResult.status === 'fulfilled') {
        dispatch(setNotifications(notificationResult.value))
      }

      if (recentBoardResult.status === 'fulfilled') {
        dispatch(setRecentBoards(recentBoardResult.value))
      }
    } catch (err) {
      toast.error('Đã có lỗi xảy ra khi tải thông tin người dùng.')
      throw err
    }
  }, [dispatch, refreshToken])

  useEffect(() => {
    fetchUserInfo()
  }, [fetchUserInfo])

  return { fetchUserInfo }
}
