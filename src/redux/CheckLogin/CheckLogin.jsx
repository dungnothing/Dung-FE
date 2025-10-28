import { Navigate, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import getCookie from '~/utils/getcookie'
import { getUserInfoAPI } from '~/apis/auth'
import { setUserInfo } from '~/redux/features/comon'

const useAuth = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.comon.user)
  const refreshToken = getCookie('refreshToken')

  useEffect(() => {
    if (refreshToken && !user.userId) {
      getUserInfoAPI()
        .then((userInfo) => {
          dispatch(setUserInfo(userInfo))
        })
        .catch(() => {
          document.cookie = 'refreshToken=; path=/; max-age=0'
          document.cookie = 'accessToken=; path=/; max-age=0'
        })
    }
  }, [refreshToken, user.userId, dispatch])

  return !!refreshToken
}

export const PublicRoute = () => {
  const isAuth = useAuth()
  return isAuth ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export const PrivateRoute = () => {
  const isAuth = useAuth()
  return isAuth ? <Outlet /> : <Navigate to="/" replace />
}
