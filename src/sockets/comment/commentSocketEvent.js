import socket from '../socket'

// Comment socket events
export const commentSocketEvents = {
  // Join card room để nhận comment events
  joinCard: (cardId) => {
    socket.emit('joinCard', cardId)
  },

  // Leave card room khi không cần thiết
  leaveCard: (cardId) => {
    socket.emit('leaveCard', cardId)
  },

  // Emit khi tạo comment mới
  createComment: (commentData) => {
    socket.emit('comment:create', commentData)
  },

  // Emit khi xóa comment
  deleteComment: (commentId, cardId) => {
    socket.emit('comment:delete', { commentId, cardId })
  }
}
