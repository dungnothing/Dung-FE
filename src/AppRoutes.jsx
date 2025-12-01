import { Routes, Route, Navigate } from 'react-router-dom'
import Board from '~/components/Board/Board'
import HomeLayout from '~/components/HomePage/HomeLayout'
import User from '~/components/User/User'
import Dashboard from '~/components/Dashboard/Dashboard'
import Payment from '~/components/User/Payment'
import GoogleCallback from '~/components/Auth/sign-in/GoogleCallback'
import { useFetchUserInfo } from './helpers/hooks/useFetchUserInfo'
import MainPage from '~/components/HomePage/MainPage'
import ControlPage from './components/HomePage/Body/Control/ControlPage'
import { PublicRoute, PrivateRoute } from './helpers/components/CheckLogin'
import PersonalInfo from './components/User/Account/Content/PersonalInfo'
import PersonalPassword from './components/User/Account/Content/PersonalPassword'
import DeleteAccount from './components/User/DeleteAccount'
import SignUp from '~/components/Auth/sign-up/SignUp'
import SignIn from '~/components/Auth/sign-in/SignIn'
import ActivateAccount from './components/Auth/sign-up/ActivateAccount'

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
        <Route path="activate" element={<ActivateAccount />} />
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
