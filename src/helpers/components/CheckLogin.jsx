import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Cookie from 'js-cookie'
import { useSelector } from 'react-redux'
import BasicLoading from '~/helpers/components/BasicLoading'
import { Box } from '@mui/material'

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
  const user = useSelector((state) => state?.comon?.user)
  const location = useLocation()

  if (!isAuth) {
    return <Navigate to="/sign-in" replace />
  }

  if (!user?.userId) {
    return (
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <BasicLoading />
      </Box>
    )
  }

  // Nếu user đã có userId nhưng subscriptions chưa được set (vẫn là undefined)
  // => Đang fetch data từ API, hiện loading
  if (user.userId && user.subscriptions === undefined) {
    return (
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <BasicLoading />
      </Box>
    )
  }

  const hasSubscription = user?.subscriptions && new Date(user.subscriptions.expiresAt) > new Date()

  const isPaymentPage = location.pathname.includes('/payment')

  // Chỉ chặn user chưa có subscription: bắt buộc vào trang payment
  if (!hasSubscription && !isPaymentPage) {
    return <Navigate to="/dashboard/payment" replace />
  }

  // User đã có subscription: tự do truy cập mọi trang (kể cả payment để upgrade)
  return <Outlet />
}
