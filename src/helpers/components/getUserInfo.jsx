// hooks/useFetchUserInfo.js
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserInfo, setStarBoards, setNotifications } from '~/redux/features/comon'
import { getUserInfoAPI } from '~/apis/auth'
import { getStarBoardAPI } from '~/apis/boards'
import getCookie from '~/utils/getcookie'
import { getNotificationAPI } from '~/apis/notification'

export const useFetchUserInfo = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const accessToken = getCookie('accessToken')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await getUserInfoAPI()
        dispatch(setUserInfo(userInfo))
        const starBoardIds = await getStarBoardAPI()
        dispatch(setStarBoards(starBoardIds))
        const notifications = await getNotificationAPI()
        dispatch(setNotifications(notifications))
      } catch (err) {
        throw new Error(err)
      }
    }

    if (accessToken) {
      fetchUser()
    }
  }, [location.pathname])
}
