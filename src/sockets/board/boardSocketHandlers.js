import { mapOrder } from '~/utils/sort'
import { generatePlaceholderCard } from '~/utils/formatters'
import { toast } from 'react-toastify'
import { updateCardInBoard } from '~/utils/formatters'

export const getBoardSocketCallbacks = (setBoard, navigate) => ({
  onColumnCreated: (newColumn) => {
    const placeholderCard = generatePlaceholderCard(newColumn)
    newColumn.cards = [placeholderCard]
    newColumn.cardOrderIds = [placeholderCard._id]
    setBoard((prev) => ({
      ...prev,
      columns: [...prev.columns, newColumn],
      columnOrderIds: [...prev.columnOrderIds, newColumn._id]
    }))
  },

  onBoardUpdated: (updatedBoard) => {
    setBoard((prev) => {
      return {
        ...prev,
        columns: mapOrder(prev.columns, updatedBoard.columnOrderIds, '_id'),
        columnOrderIds: updatedBoard.columnOrderIds || prev.columnOrderIds
      }
    })
  },

  onColumnUpdated: (updatedColumn) => {
    setBoard((prev) => {
      const newBoard = { ...prev }
      const col = newBoard.columns.find((c) => c._id === updatedColumn._id)
      if (col) {
        col.cardOrderIds = updatedColumn.cardOrderIds
        col.cards = mapOrder(col.cards, updatedColumn.cardOrderIds, '_id')
      }
      return newBoard
    })
  },

  onBoardDeleted: (deletedBoard) => {
    if (!deletedBoard?.acknowledged) return
    toast.info('Bảng đã bị xóa, bạn sẽ bị chuyển về trang chủ trong vài giây tới')
    setTimeout(() => {
      navigate('/dashboard')
    }, 2000)
  },

  onMoveCardToDifferentColumn: (data) => {
    setBoard((prev) => {
      const newBoard = { ...prev }
      const nextColumn = newBoard.columns.find((col) => col._id === data.nextColumnId)
      if (nextColumn) {
        nextColumn.cardOrderIds = data.nextCardOrderIds
        // Neu nextColumn chi co 1 card thi de card moi len card placeholder
        if (nextColumn.cardOrderIds.length === 1) {
          nextColumn.cards = [data.cardMove]
          nextColumn.cardOrderIds = [data.cardMove._id]
        } else {
          nextColumn.cards.push(data.cardMove)
        }
        nextColumn.cards = mapOrder(nextColumn.cards, data.nextCardOrderIds, '_id')
      }

      // Xu li prev column
      const prevColumn = newBoard.columns.find((col) => col._id === data.prevColumnId)
      if (prevColumn) {
        prevColumn.cardOrderIds = data.prevCardOrderIds
        if (prevColumn.cardOrderIds.length === 0) {
          prevColumn.cards = [generatePlaceholderCard(prevColumn)]
          prevColumn.cardOrderIds = [generatePlaceholderCard(prevColumn)._id]
        } else {
          prevColumn.cards = prevColumn.cards.filter((card) => card._id !== data.cardMove._id)
        }
        prevColumn.cards = mapOrder(prevColumn.cards, data.prevCardOrderIds, '_id')
      }
      return newBoard
    })
  },

  onColumnDeleted: (columnId) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.filter((col) => col._id !== columnId),
      columnOrderIds: prev.columnOrderIds.filter((id) => id !== columnId)
    }))
  },

  onCardCreated: (newCard) => {
    setBoard((prev) => {
      const newBoard = { ...prev }
      const col = newBoard.columns.find((col) => col._id === newCard.columnId)
      if (col) {
        if (col.cards.some((card) => card.FE_PlaceholderCard)) {
          col.cards = [newCard]
          col.cardOrderIds = [newCard._id]
        } else {
          col.cards.push(newCard)
          col.cardOrderIds.push(newCard._id)
        }
      }
      return newBoard
    })
  },

  onBoardUpdatedTitle: (updatedBoard) => {
    setBoard((prev) => {
      return {
        ...prev,
        title: updatedBoard.title
      }
    })
  },

  onBoardUpdatedVisibility: (updatedBoard) => {
    setBoard((prev) => {
      return {
        ...prev,
        visibility: updatedBoard.visibility
      }
    })
  },

  onBoardUpdatedState: (updatedBoard) => {
    setBoard((prev) => {
      return {
        ...prev,
        boardState: updatedBoard.boardState
      }
    })
  },

  onCardUpdated: (updatedCard) => {
    setBoard((prev) => updateCardInBoard(prev, updatedCard._id, updatedCard))
  },

  onCommentCreated: (newComment) => {
    // Comment handler sẽ được xử lý trong component CardComments
    // Chỉ cần update commentIds trong card
    setBoard((prev) => {
      const newBoard = { ...prev }
      const col = newBoard.columns.find((c) => c.cards.some((card) => card._id === newComment.cardId))
      if (col) {
        const card = col.cards.find((card) => card._id === newComment.cardId)
        if (card) {
          if (!card.commentIds) card.commentIds = []
          if (!card.commentIds.includes(newComment._id)) {
            card.commentIds.push(newComment._id)
          }
        }
      }
      return newBoard
    })
  },

  onCommentDeleted: (deletedData) => {
    // Xử lý xóa commentId khỏi card
    setBoard((prev) => {
      const newBoard = { ...prev }
      const col = newBoard.columns.find((c) => c.cards.some((card) => card._id === deletedData.cardId))
      if (col) {
        const card = col.cards.find((card) => card._id === deletedData.cardId)
        if (card && card.commentIds) {
          card.commentIds = card.commentIds.filter((id) => id !== deletedData.commentId)
        }
      }
      return newBoard
    })
  }
})
