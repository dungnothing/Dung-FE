import { Routes, Route, Navigate } from 'react-router-dom'
import Board from '~/components/Board/Board'
import HomeLayout from '~/components/HomePage/layout/HomeLayout'
import User from '~/components/User/User'
import Dashboard from '~/components/Dashboard/Dashboard'
import Payment from '~/components/Dashboard/DashboardContent/Payment/Payment'
import GoogleCallback from '~/components/Auth/sign-in/GoogleCallback'
import { useFetchUserInfo } from './helpers/hooks/useFetchUserInfo'
import MainPage from '~/components/HomePage/MainPage'
import MainBoard from '~/components/Dashboard/DashboardContent/MainBoard/MainBoard'
import Template from '~/components/Dashboard/DashboardContent/Template/Template'
import Task from '~/components/Dashboard/DashboardContent/Task/Task'
import Setting from '~/components/Dashboard/DashboardContent/Setting/Setting'
import { PublicRoute, PrivateRoute } from './components/Auth/CheckLogin'
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
        </Route>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/google-callback" element={<GoogleCallback />} />
        <Route path="activate" element={<ActivateAccount />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="boards" replace />} />
          <Route path="boards" element={<MainBoard />} />
          <Route path="templates" element={<Template />} />
          <Route path="tasks" element={<Task />} />
          <Route path="settings" element={<Setting />} />
          <Route path="payment" element={<Payment />} />
        </Route>
        <Route path="/boards/:boardId" element={<Board />} />

        <Route element={<User />} path="user">
          <Route index element={<Navigate to="info" replace />} />
          <Route path="info" element={<PersonalInfo />} />
          <Route path="password" element={<PersonalPassword />} />
          <Route path="delete" element={<DeleteAccount />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
