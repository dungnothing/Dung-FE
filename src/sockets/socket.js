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

// Board hien tai user dang xem. Khi socket reconnect, dung cai nay de tu re-join phong
// (server reset phong sau khi client mat ket noi, neu khong re-join thi tab miss event).
let currentBoardId = null

const handleReconnectJoin = () => {
  if (currentBoardId) socket.emit('join-board', currentBoardId)
}

export const setupSocketListeners = () => {
  socket.auth.token = getCookie('accessToken')
  socket.on('disconnect', () => {})

  socket.off('connect', handleReconnectJoin)
  socket.on('connect', handleReconnectJoin)

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
  currentBoardId = boardId
  socket.emit('join-board', boardId)
}

export const leaveBoard = (boardId) => {
  if (currentBoardId === boardId) currentBoardId = null
  socket.emit('leave-board', boardId)
}

export default socket
