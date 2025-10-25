import { configureStore } from '@reduxjs/toolkit'
import comonReducer from './features/comon'

// Redux State management tool
const store = configureStore({
  reducer: {
    comon: comonReducer
  }
})

export default store
