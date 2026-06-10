import { io } from 'socket.io-client'
import { toast } from 'react-toastify'
import { API_ROOT } from '../utils/constants'
import Cookie from 'js-cookie'
import store from '../redux/store'
import { addNotification } from '../redux/features/comon'

const getCookie = (name) => Cookie.get(name)

const socket = io(API_ROOT, {
  transports: ['websocket'],
  withCredentials: true,
  autoConnect: true,
  auth: {
    token: getCookie('accessToken')
  }
})

const handleNewNotification = (notification) => {
  store.dispatch(addNotification(notification))
  toast.info(notification.content)
}

export const setupSocketListeners = () => {
  socket.auth.token = getCookie('accessToken')
  socket.on('connect', () => {})
  socket.on('disconnect', () => {})

  socket.off('notification:new', handleNewNotification)
  socket.on('notification:new', handleNewNotification)
}

// BE chủ động disconnect khi token thiếu/sai (vd: socket connect trước khi login),
// trường hợp đó client không tự reconnect nên cần gọi lại sau khi đăng nhập thành công
export const reconnectSocket = () => {
  socket.auth.token = getCookie('accessToken')
  if (!socket.connected && socket.auth.token) {
    socket.connect()
  }
}

export const sendMessage = (message) => {
  socket.emit('message', message)
}

export const joinBoard = (boardId) => {
  socket.emit('join-board', boardId)
}

export default socket
