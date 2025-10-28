import socket from '../socket'

export const initBoardSocket = (
  boardId,
  {
    onColumnCreated,
    onColumnUpdated,
    onColumnDeleted,
    onCardCreated,
    onBoardUpdated,
    onBoardDeleted,
    onMoveCardToDifferentColumn,
    onBoardUpdatedTitle,
    onBoardUpdatedVisibility,
    onBoardUpdatedState,
    onCardUpdated,
    onCommentCreated,
    onCommentDeleted
  }
) => {
  if (socket.joinedBoardId !== boardId) {
    socket.emit('join-board', boardId)
    socket.joinedBoardId = boardId
  }

  // Handlers
  const listeners = [
    { event: 'column:created', handler: onColumnCreated },
    { event: 'column:updated', handler: onColumnUpdated },
    { event: 'column:deleted', handler: onColumnDeleted },
    { event: 'card:created', handler: onCardCreated },
    { event: 'card:move-diff', handler: onMoveCardToDifferentColumn },
    { event: 'board:updated', handler: onBoardUpdated },
    { event: 'board:deleted', handler: onBoardDeleted },
    { event: 'board:updated-title', handler: onBoardUpdatedTitle },
    { event: 'board:updated-visibility', handler: onBoardUpdatedVisibility },
    { event: 'board:updated-state', handler: onBoardUpdatedState },
    { event: 'card:updated', handler: onCardUpdated },
    { event: 'card:backgroundUpdated', handler: onCardUpdated },
    { event: 'card:fileUploaded', handler: onCardUpdated },
    { event: 'card:fileRemoved', handler: onCardUpdated },
    { event: 'comment:created', handler: onCommentCreated },
    { event: 'comment:deleted', handler: onCommentDeleted }
  ]

  // Đăng ký các lắng nghe
  // Đăng ký các lắng nghe
  listeners.forEach(({ event, handler }) => {
    if (handler) socket.on(event, handler)
  })

  // Trả về hàm cleanup
  return () => {
    listeners.forEach(({ event, handler }) => {
      if (handler) socket.off(event, handler)
    })
  }
}
