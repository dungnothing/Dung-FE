import { Routes, Route, Navigate } from 'react-router-dom'
import Board from '~/pages/Board/Board'
import HomeLayout from '~/pages/HomePage/HomeLayout'
import User from '~/pages/User/User'
import Dashboard from '~/pages/Dashboard/Dashboard'
import Payment from '~/pages/User/Payment'
import GoogleCallback from '~/pages/Auth/sign-in/GoogleCallback'
import { useFetchUserInfo } from './helpers/components/getUserInfo'
import MainPage from '~/pages/HomePage/MainPage'
import ControlPage from './components/HomePage/Body/Control/ControlPage'
import { PublicRoute, PrivateRoute } from './redux/CheckLogin/CheckLogin'
import PersonalInfo from './pages/User/PersonalInfo'
import PersonalPassword from './pages/User/PersonalPassword'
import DeleteAccount from './pages/User/DeleteAccount'
import SignUp from '~/pages/Auth/sign-up/SignUp'
import SignIn from '~/pages/Auth/sign-in/SignIn'

function AppRoutes() {
  useFetchUserInfo()
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<HomeLayout />}>
          <Route index element={<MainPage />} />
          <Route path="control" element={<ControlPage />} />
        </Route>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/google-callback" element={<GoogleCallback />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/boards/:boardId" element={<Board />} />

        <Route element={<User />} path="user">
          <Route index element={<Navigate to="info" replace />} />
          <Route path="info" element={<PersonalInfo />} />
          <Route path="password" element={<PersonalPassword />} />
          <Route path="delete" element={<DeleteAccount />} />
        </Route>

        <Route path="/pay" element={<Payment />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
