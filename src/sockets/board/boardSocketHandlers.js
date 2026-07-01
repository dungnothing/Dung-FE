import { mapOrder } from '~/utils/sort'
import { toast } from 'react-toastify'
import { updateCardInBoard } from '~/utils/formatters'

export const getBoardSocketCallbacks = (setBoard, navigate) => ({
  onColumnCreated: (newColumn) => {
    newColumn.cards = []
    newColumn.cardOrderIds = []
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
      navigate('/dashboard/boards')
    }, 2000)
  },

  onMoveCardToDifferentColumn: (data) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => {
        if (col._id === data.nextColumnId) {
          const mergedCards = col.cards.some((c) => c._id === data.cardMove._id)
            ? col.cards
            : [...col.cards.filter((c) => !c.FE_PlaceholderCard), data.cardMove]
          return {
            ...col,
            cardOrderIds: data.nextCardOrderIds,
            cards: mapOrder(mergedCards, data.nextCardOrderIds, '_id')
          }
        }

        if (col._id === data.prevColumnId) {
          if (data.prevCardOrderIds.length === 0) {
            return { ...col, cardOrderIds: [], cards: [] }
          }
          return {
            ...col,
            cardOrderIds: data.prevCardOrderIds,
            cards: mapOrder(
              col.cards.filter((c) => c._id !== data.cardMove._id),
              data.prevCardOrderIds,
              '_id'
            )
          }
        }

        return col
      })
    }))
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
