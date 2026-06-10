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
    createdAt: null,
    subscriptions: undefined // undefined = chưa load, null = đã load nhưng không có subscription
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
      const {
        userName,
        email,
        avatar,
        vip,
        userId,
        address,
        phone,
        isGoogleAccount,
        organization,
        createdAt,
        subscriptions
      } = action.payload
      state.user = {
        userName,
        email,
        avatar,
        vip,
        userId,
        address,
        phone,
        isGoogleAccount,
        organization,
        createdAt,
        subscriptions
      }
    },
    logout: (state) => {
      state.user = initialState.user
      state.notifications = []
      state.starBoards = []
      state.recentBoards = []
    },
    updateUserInfo: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload
    },
    addNotification: (state, action) => {
      // Tránh trùng khi vừa nhận qua socket vừa refetch qua API
      const exists = state.notifications.some((notification) => notification._id === action.payload._id)
      if (!exists) {
        state.notifications = [action.payload, ...state.notifications]
      }
    },
    setRecentBoards: (state, action) => {
      state.recentBoards = action.payload
    },
    setMarkAsRead: (state, action) => {
      state.notifications = state.notifications.map((notification) => {
        if (notification._id === action.payload) {
          return { ...notification, isRead: true }
        }
        return notification
      })
    }
  }
})

export const {
  setStarBoards,
  setUserInfo,
  logout,
  updateUserInfo,
  setNotifications,
  addNotification,
  setRecentBoards,
  setMarkAsRead
} = commonSlice.actions

export default commonSlice.reducer
