import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {
    userId: null,
    userName: null,
    email: null,
    avatar: '/default-avatar.png',
    vip: false,
    address: null,
    phone: null,
    isGoogleAccount: false,
    organization: null,
    createdAt: null
  },
  notifications: [],
  starBoards: [],
  recentBoards: []
}

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setStarBoards: (state, action) => {
      state.starBoards = action.payload
    },
    setUserInfo: (state, action) => {
      const { userName, email, avatar, vip, userId, address, phone, isGoogleAccount, organization, createdAt } =
        action.payload
      state.isAuthenticated = true
      state.user = { userName, email, avatar, vip, userId, address, phone, isGoogleAccount, organization, createdAt }
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = initialState.user
      state.notifications = []
    },
    updateUserInfo: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload
    },
    setRecentBoards: (state, action) => {
      state.recentBoards = action.payload
    }
  }
})

export const { setStarBoards, setUserInfo, logout, updateUserInfo, setNotifications, setRecentBoards } =
  commonSlice.actions

export default commonSlice.reducer
