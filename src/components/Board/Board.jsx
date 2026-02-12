import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from '../../components/Board/BoardBar/BoardBar'
import BoardContent from '../../components/Board/BoardContent/BoardContent'
import { useParams } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { fetchBoardDetailsAPI, updateBoardDetailsAPI, moveCardToDifferentColumnAPI } from '~/apis/boards'
import { createNewCardAPI } from '~/apis/cards'
import { createNewColumnAPI, deleteColumnDetailsAPI, updateColumnDetailsAPI } from '~/apis/columns'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sort'
import BasicLoading from '~/helpers/components/BasicLoading'
import { toast } from 'react-toastify'
import { PERMISSIONS_MAP } from '~/utils/permissions'
import { initBoardSocket, getBoardSocketCallbacks } from '~/sockets/board'
import useDebounce from '~/helpers/hooks/useDebonce'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '~/utils/messageHelper'

function Board() {
  const { boardId } = useParams()
  const [board, setBoard] = useState(null)
  const navigate = useNavigate()
  const [permissions, setPermissions] = useState(null)
  const [allUserInBoard, setAllUserInBoard] = useState({ admin: {}, members: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [filterLoading, setFilterLoading] = useState(false)
  const [filters, setFilters] = useState({
    term: '',
    overdue: '',
    dueTomorrow: '',
    noDue: ''
  })
  const debouncedFilters = useDebounce(filters, 500)
  const firstFilterRun = useRef(true)
  const isFiltering =
    !!debouncedFilters.term || !!debouncedFilters.overdue || !!debouncedFilters.dueTomorrow || !!debouncedFilters.noDue

  const fetchBoardData = async (firstLoad = false) => {
    try {
      if (firstLoad) {
        setIsLoading(true)
      } else {
        setFilterLoading(true)
      }

      const params = {
        overdue: debouncedFilters.overdue || undefined,
        dueTomorrow: debouncedFilters.dueTomorrow || undefined,
        noDue: debouncedFilters.noDue || undefined,
        term: debouncedFilters.term?.trim() || undefined
      }

      const boardRes = await fetchBoardDetailsAPI(boardId, params)
      boardRes.columns = mapOrder(boardRes.columns, boardRes.columnOrderIds, '_id')

      boardRes.columns.forEach((column) => {
        if (isEmpty(column.cardOrderIds)) {
          const placeholderCard = generatePlaceholderCard(column)
          column.cards = [placeholderCard]
          column.cardOrderIds = [placeholderCard._id]
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      setBoard(boardRes)
      setPermissions(PERMISSIONS_MAP[boardRes.userRole])
      setAllUserInBoard({ admin: boardRes.admin, members: boardRes.members })
    } catch (error) {
      if (error.status === 404 || error.status === 403) {
        navigate('/dashboard/boards')
        toast.error(getErrorMessage(error, 'Không thể truy cập bảng'))
        return
      }
      toast.error(getErrorMessage(error, 'Lỗi khi lấy dữ liệu bảng'))
    } finally {
      setIsLoading(false)
      setFilterLoading(false)
    }
  }

  useEffect(() => {
    fetchBoardData(true)
  }, [boardId])

  useEffect(() => {
    if (firstFilterRun.current) {
      firstFilterRun.current = false
      return
    }
    fetchBoardData(false)
  }, [debouncedFilters])

  // Socket
  useEffect(() => {
    if (!boardId) return
    const socketHandlers = getBoardSocketCallbacks(setBoard, navigate)
    const cleanup = initBoardSocket(boardId, socketHandlers)
    return cleanup
  }, [boardId])

  const createNewColumn = async (newColumnData) => {
    if (!permissions.CREATE_COLUMN) {
      toast.error('Bạn không có quyền')
      return
    }
    const newColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    const placeholderCard = generatePlaceholderCard(newColumn)
    newColumn.cards = [placeholderCard]
    newColumn.cardOrderIds = [placeholderCard._id]
    setBoard((prev) => ({
      ...prev,
      columns: [...prev.columns, newColumn],
      columnOrderIds: [...prev.columnOrderIds, newColumn._id]
    }))
  }

  const createNewCard = async (newCardData) => {
    if (isFiltering) {
      toast.error('Không thể thực hiện khi đang lọc')
      return
    }
    try {
      if (!permissions.CREATE_CARD) {
        toast.error('Bạn không có quyền')
        return
      }
      const newCard = await createNewCardAPI({
        ...newCardData,
        boardId: board._id
      })
      setBoard((prev) => {
        const newBoard = { ...prev }
        const col = newBoard.columns.find((col) => col._id === newCardData.columnId)
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
    } catch (error) {
      toast.error('Lỗi khi tạo card')
    }
  }

  const moveColumns = async (dndOrderedColumns) => {
    try {
      if (!permissions.MOVING_COLUMN) {
        toast.error('Bạn không có quyền')
        return
      }
      // Update cho chuan du lieu state Board
      const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
      setBoard((prev) => ({
        ...prev,
        columns: dndOrderedColumns,
        columnOrderIds: dndOrderedColumnsIds
      }))
      await updateBoardDetailsAPI(board._id, { columnOrderIds: dndOrderedColumnsIds })
    } catch (error) {
      toast.error('Lỗi khi di chuyển column')
    }
  }

  const moverCardInTheSameColumn = async (dndOrderedCards, dndOrderedCardIds, columnId) => {
    if (isFiltering) {
      toast.error('Không thể thực hiện khi đang lọc')
      return
    }
    if (!permissions.MOVING_CARD) {
      toast.error('Bạn không có quyền')
      return
    }
    const rollBackData = { ...board }

    try {
      // Update cho chuan du lieu
      if (isFiltering) {
        toast.error('Không thể thực hiện khi đang lọc')
        return
      }
      const newBoard = { ...board }
      const columnToUpdate = newBoard.columns.find((column) => column._id === columnId)
      if (columnToUpdate) {
        columnToUpdate.cards = dndOrderedCards
        columnToUpdate.cardOrderIds = dndOrderedCardIds
        newBoard.cards = dndOrderedCards
      }
      setBoard(newBoard)

      // Goi API update Column
      await updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds, boardId: board._id })
    } catch (error) {
      toast.error('Lỗi khi di chuyển card')
      setBoard(rollBackData)
    }
  }

  const moveCardToDifferentColumn = async (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    if (!permissions.MOVING_CARD) {
      toast.error('Bạn không có quyền')
      return
    }
    const rollBackData = { ...board }
    try {
      if (isFiltering) {
        toast.error('Không thể thực hiện khi đang lọc')
        return
      }
      // Update cho chuan du lieu state Board
      const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
      const newBoard = { ...board }
      newBoard.columns = dndOrderedColumns
      newBoard.columnOrderIds = dndOrderedColumnsIds
      setBoard(newBoard)

      // Goi API xu li
      let prevCardOrderIds = dndOrderedColumns.find((c) => c._id === prevColumnId)?.cardOrderIds
      // Xu li van de khi keo Card cuoi cung ra khoi Column, column rong se co placehorlder-card, can xoa di truoc khi gui du lieu cho BE
      if (prevCardOrderIds[0].includes('placehorlder-card')) prevCardOrderIds = []

      const data = {
        currentCardId,
        prevColumnId,
        prevCardOrderIds,
        nextColumnId,
        nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)?.cardOrderIds,
        boardId: board._id
      }

      await moveCardToDifferentColumnAPI(data)
    } catch (error) {
      toast.error('Lỗi khi di chuyển card')
      setBoard(rollBackData)
    }
  }

  const deleteColumnDetails = async (columnId) => {
    try {
      if (!permissions.DELETE_COLUMN) {
        toast.error('Bạn không có quyền')
        return
      }
      const newBoard = { ...board }
      newBoard.columns = newBoard.columns.filter((c) => c._id !== columnId)
      newBoard.columnOrderIds = newBoard.columnOrderIds.filter((_id) => _id !== columnId)
      setBoard(newBoard)

      await deleteColumnDetailsAPI(columnId, boardId)
      toast.success('Xóa cột thành công')
    } catch (error) {
      toast.error('Lỗi khi xóa cột')
    }
  }

  if (!board || isLoading)
    return (
      <Box sx={{ width: '100vw', height: '100vh' }}>
        <BasicLoading />
      </Box>
    )

  return (
    <Container key={boardId} disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar sx={{ position: 'fixed', top: 0, zIndex: 1 }} showSearch={false} />
      <BoardBar
        board={board}
        setBoard={setBoard}
        allUserInBoard={allUserInBoard}
        permissions={permissions}
        setFilters={setFilters}
        filters={filters}
        filterLoading={filterLoading}
      />
      <BoardContent
        board={board}
        setBoard={setBoard}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moverCardInTheSameColumn={moverCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
        fetchBoarData={fetchBoardData}
        permissions={permissions}
        isFiltering={isFiltering}
      />
    </Container>
  )
}

export default Board
