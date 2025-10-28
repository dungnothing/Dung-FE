import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from '../../components/Board/BoardBar/BoardBar'
import BoardContent from '../../components/Board/BoardContent/BoardContent'
import { useParams } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import {
  fetchBoardDetailsAPI,
  updateBoardDetailsAPI,
  moveCardToDifferentColumnAPI,
  getAllUserInBoardAPI
} from '~/apis/boards'
import { createNewCardAPI } from '~/apis/cards'
import { createNewColumnAPI, deleteColumnDetailsAPI, updateColumnDetailsAPI } from '~/apis/columns'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sort'
import Loading from '~/helpers/components/Loading'
import { toast } from 'react-toastify'
import { GUEST_PERMISSIONS, ADMIN_PERMISSIONS, MEMBER_PERMISSIONS } from '~/utils/permissions'
import { initBoardSocket, getBoardSocketCallbacks } from '~/sockets/board'
import useDebounce from '~/helpers/hooks/useDebonce'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

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
      switch (boardRes.userRole) {
        case 'GUEST':
          setPermissions(GUEST_PERMISSIONS)
          break
        case 'MEMBER':
          setPermissions(MEMBER_PERMISSIONS)
          break
        case 'ADMIN':
          setPermissions(ADMIN_PERMISSIONS)
          break
      }
    } catch (error) {
      if (error.status === 404 || error.status === 403) {
        navigate('/dashboard')
        return
      }
      toast.error('Lỗi khi lấy dữ liệu bảng')
    } finally {
      setIsLoading(false)
      setFilterLoading(false)
    }
  }

  useEffect(() => {
    fetchBoardData(true) // load lần đầu
  }, [boardId])

  useEffect(() => {
    if (firstFilterRun.current) {
      firstFilterRun.current = false
      return
    }
    fetchBoardData(false)
  }, [debouncedFilters])

  // console.log('board', board)

  // Socket
  useEffect(() => {
    if (!boardId) return
    const socketHandlers = getBoardSocketCallbacks(setBoard, navigate)
    const cleanup = initBoardSocket(boardId, socketHandlers)
    return cleanup
  }, [boardId])

  const getAllUserInBoard = async () => {
    try {
      const users = await getAllUserInBoardAPI(boardId)
      setAllUserInBoard(users)
    } catch (error) {
      toast.error('Lỗi khi lấy danh sách thành viên')
    }
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const users = await getAllUserInBoardAPI(boardId)
        setAllUserInBoard(users)
      } catch (error) {
        toast.error('Lỗi lấy thành viên!')
      }
    }
    getUser()
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
    if (!permissions.MOVING_CARD) {
      toast.error('Bạn không có quyền')
      return
    }
    const rollBackData = { ...board }

    try {
      // Update cho chuan du lieu
      const newBoard = { ...board }
      const columnToUpdate = newBoard.columns.find((column) => column._id === columnId)
      if (columnToUpdate) {
        columnToUpdate.cards = dndOrderedCards
        columnToUpdate.cardOrderIds = dndOrderedCardIds
        newBoard.cards = dndOrderedCards
      }
      setBoard(newBoard)
      // Goi API update Column
      await updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
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

      await moveCardToDifferentColumnAPI({
        currentCardId,
        prevColumnId,
        prevCardOrderIds,
        nextColumnId,
        nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)?.cardOrderIds,
        boardId: boardId
      })
    } catch (error) {
      toast.error('Lỗi khi di chuyển card')
      setBoard(rollBackData)
    }
  }

  const deleteColumnDetails = async (columnId) => {
    if (!permissions.DELETE_COLUMN) {
      toast.error('Bạn không có quyền')
      return
    }
    // Update cho chuan du lieu state Board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter((c) => c._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter((_id) => _id !== columnId)
    setBoard(newBoard)

    // Goi API xu li
    await deleteColumnDetailsAPI(columnId)
    toast.success('Xóa cột thành công')
  }

  if (!board || isLoading)
    return (
      <Box sx={{ width: '100vw', height: '100vh' }}>
        <Loading />
      </Box>
    )

  return (
    <Container key={boardId} disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar sx={{ position: 'fixed', top: 0, zIndex: 1 }} showSearch={false} />
      <BoardBar
        board={board}
        setBoard={setBoard}
        getAllUserInBoard={getAllUserInBoard}
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
      />
    </Container>
  )
}

export default Board
