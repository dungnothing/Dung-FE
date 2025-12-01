import { Navigate, Outlet } from 'react-router-dom'
import Cookie from 'js-cookie'

const getCookie = (name) => Cookie.get(name)

const useAuth = () => {
  const refreshToken = getCookie('refreshToken')
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
