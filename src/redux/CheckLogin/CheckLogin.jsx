import { Navigate, Outlet } from 'react-router-dom'
import getCookie from '~/utils/getcookie'

const useAuth = () => {
  const token = getCookie('refreshToken')
  return !!token
}

export const PublicRoute = () => {
  const isAuth = useAuth()
  return isAuth ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export const PrivateRoute = () => {
  const isAuth = useAuth()
  return isAuth ? <Outlet /> : <Navigate to="/" replace />
}
