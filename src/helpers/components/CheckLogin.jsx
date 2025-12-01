import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Cookie from 'js-cookie'
import { useSelector } from 'react-redux'
import Loading from '~/helpers/components/Loading'
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
        <Loading />
      </Box>
    )
  }

  const hasSubscription = user?.subscriptions && new Date(user.subscriptions.expiresAt) > new Date()

  const searchParams = new URLSearchParams(location.search)
  const isPaymentTab = location.pathname === '/dashboard' && searchParams.get('tab') === 'Payment'

  if (isPaymentTab) {
    return <Outlet />
  }

  if (!hasSubscription) {
    return <Navigate to="/dashboard?tab=Payment" replace />
  }

  return <Outlet />
}
