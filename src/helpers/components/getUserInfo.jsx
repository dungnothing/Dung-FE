// hooks/useFetchUserInfo.js
import { useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUserInfo, setStarBoards, setNotifications } from '~/redux/features/comon'
import { getUserInfoAPI } from '~/apis/auth'
import { getStarBoardAPI } from '~/apis/boards'
import getCookie from '~/utils/getcookie'
import { getNotificationAPI } from '~/apis/notification'
import { toast } from 'react-toastify'

export const useFetchUserInfo = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const isInitialized = useRef(false)
  const user = useSelector((state) => state.common?.user)

  const accessToken = getCookie('accessToken')
  const refreshToken = getCookie('refreshToken')
  const hasValidTokens = accessToken && refreshToken

  const fetchUserData = useCallback(async () => {
    if (!hasValidTokens) return

    try {
      const [userResult, starBoardResult, notificationResult] = await Promise.allSettled([
        getUserInfoAPI(),
        getStarBoardAPI(),
        getNotificationAPI()
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
    } catch (err) {
      toast.error('Đã có lỗi xảy ra khi tải thông tin người dùng.')
    }
  }, [hasValidTokens, dispatch])

  useEffect(() => {
    const shouldFetch = hasValidTokens && (!user?.userId || !isInitialized.current)

    if (shouldFetch) {
      fetchUserData()
      isInitialized.current = true
    }
  }, [hasValidTokens, user?.userId, location.pathname, fetchUserData])

  useEffect(() => {
    if (!hasValidTokens) {
      isInitialized.current = false
    }
  }, [hasValidTokens])
}
