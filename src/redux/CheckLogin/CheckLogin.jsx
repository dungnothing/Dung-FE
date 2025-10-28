import { Navigate, Outlet } from 'react-router-dom'
import getCookie from '~/utils/getcookie'

const useAuth = () => {
  const accessToken = getCookie('accessToken')
  const refreshToken = getCookie('refreshToken')
  // Đảm bảo có cả 2 token để xác định user đã đăng nhập
  return !!(accessToken && refreshToken)
}

export const PublicRoute = () => {
  const isAuth = useAuth()
  return isAuth ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export const PrivateRoute = () => {
  const isAuth = useAuth()
  return isAuth ? <Outlet /> : <Navigate to="/" replace />
}
