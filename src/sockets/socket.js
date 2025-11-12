import { io } from 'socket.io-client'
import { API_ROOT } from '../utils/constants'
import Cookie from 'js-cookie'

const getCookie = (name) => Cookie.get(name)

const socket = io(API_ROOT, {
  transports: ['websocket'],
  withCredentials: true,
  autoConnect: true,
  auth: {
    token: getCookie('accessToken')
  }
})

export const setupSocketListeners = () => {
  socket.auth.token = getCookie('accessToken')
  socket.on('connect', () => {})
  socket.on('disconnect', () => {})
}

export const sendMessage = (message) => {
  socket.emit('message', message)
}

export const joinBoard = (boardId) => {
  socket.emit('join-board', boardId)
}

export default socket
