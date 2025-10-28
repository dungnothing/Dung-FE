import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import socket from '../socket'
import { commentSocketEvents } from './commentSocketEvent'

export const useCommentSocketHandlers = (cardId, setComments, setTotalCount) => {
  const user = useSelector((state) => state.comon.user)

  useEffect(() => {
    if (!cardId) return

    // Join card room khi component mount
    commentSocketEvents.joinCard(cardId)

    // Handler cho comment created event
    const handleCommentCreated = (newComment) => {
      if (newComment.cardId?.toString() === cardId?.toString() && newComment.userInfo?._id !== user?.userId) {
        setComments((prevComments) => [newComment, ...prevComments])
        setTotalCount((prev) => prev + 1)
      }
    }

    // Handler cho comment deleted event
    const handleCommentDeleted = ({ commentId, cardId: deletedCardId }) => {
      if (deletedCardId?.toString() === cardId?.toString()) {
        setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId))
        setTotalCount((prev) => prev - 1)
      }
    }

    // Đăng ký event listeners
    socket.on('comment:created', handleCommentCreated)
    socket.on('comment:deleted', handleCommentDeleted)

    // Cleanup khi component unmount
    return () => {
      commentSocketEvents.leaveCard(cardId)
      socket.off('comment:created', handleCommentCreated)
      socket.off('comment:deleted', handleCommentDeleted)
    }
  }, [cardId, user?.userId, setComments, setTotalCount])
}
