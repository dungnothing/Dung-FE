import Container from '@mui/material/Container'
import { Box } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from '../BoardBar/BoardBar'
import BoardContent from '../../components/Board/BoardContent/BoardContent'
import {
  fetchBoardDetailsAPI,
  updateBoardDetailsAPI,
  moveCardToDifferentColumnAPI,
  getAllUserInBoardAPI
} from '~/apis/boards'
import { createNewCardAPI } from '~/apis/cards'
import { createNewColumnAPI, deleteColumnDetailsAPI, updateColumnDetailsAPI } from '~/apis/columns'
import { generatePlaceholderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sort'
import BasicLoading from '~/helpers/components/BasicLoading'
import { PERMISSIONS_MAP } from '~/utils/permissions'
import { handleError } from '~/utils/messageHelper'
import { initBoardSocket, getBoardSocketCallbacks } from '~/sockets/board'
import useDebounce from '~/helpers/hooks/useDebonce'
import { useMoveCardQueue } from '~/helpers/hooks/useMoveCardQueue'

const EMPTY_FILTERS = { term: '', overdue: '', dueTomorrow: '', noDue: '' }
const isPlaceholderId = (id) => typeof id === 'string' && id.includes('placehorlder-card')

// Gắn cards (đã sắp xếp) vào mỗi column; column rỗng dùng placeholder card
const withOrderedCards = (column) => {
  if (isEmpty(column.cardOrderIds)) {
    const placeholder = generatePlaceholderCard(column)
    return { ...column, cards: [placeholder], cardOrderIds: [placeholder._id] }
  }
  return { ...column, cards: mapOrder(column.cards, column.cardOrderIds, '_id') }
}

function Board() {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const [board, setBoard] = useState(null)
  const [permissions, setPermissions] = useState(null)
  const [allUserInBoard, setAllUserInBoard] = useState({ admin: {}, members: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [filterLoading, setFilterLoading] = useState(false)
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const debouncedFilters = useDebounce(filters, 500)
  const firstFilterRun = useRef(true)
  const isFiltering = Object.values(debouncedFilters).some(Boolean)

  // Báo lỗi rồi trả false nếu không đủ điều kiện thao tác (quyền / đang lọc)
  const ensure = (hasPermission, { blockWhileFiltering = false } = {}) => {
    if (!hasPermission) {
      toast.error('Bạn không có quyền')
      return false
    }
    if (blockWhileFiltering && isFiltering) {
      toast.error('Không thể thực hiện khi đang lọc')
      return false
    }
    return true
  }

  const fetchBoardData = async (firstLoad = false) => {
    try {
      firstLoad ? setIsLoading(true) : setFilterLoading(true)
      const params = {
        overdue: debouncedFilters.overdue || undefined,
        dueTomorrow: debouncedFilters.dueTomorrow || undefined,
        noDue: debouncedFilters.noDue || undefined,
        term: debouncedFilters.term?.trim() || undefined
      }
      const boardRes = await fetchBoardDetailsAPI(boardId, params)
      boardRes.columns = mapOrder(boardRes.columns, boardRes.columnOrderIds, '_id').map(withOrderedCards)
      setBoard(boardRes)
      setPermissions(PERMISSIONS_MAP[boardRes.userRole])
    } catch (error) {
      if (error.status === 404 || error.status === 403) {
        navigate('/dashboard/boards')
        handleError(error, 'Không thể truy cập bảng')
        return
      }
      handleError(error, 'Lỗi khi lấy dữ liệu bảng')
    } finally {
      setIsLoading(false)
      setFilterLoading(false)
    }
  }

  const fetchAllUserInBoard = async () => {
    try {
      const response = await getAllUserInBoardAPI(boardId)
      if (response) setAllUserInBoard(response)
    } catch (error) {
      handleError(error, 'Lỗi khi lấy danh sách người dùng')
    }
  }

  // Queue serialize cac request move-card. Khi 1 request fail -> goi fetchBoardData de reset.
  const enqueueMove = useMoveCardQueue(() => fetchBoardData(false))

  useEffect(() => {
    fetchBoardData(true)
    fetchAllUserInBoard()
  }, [boardId])

  useEffect(() => {
    if (firstFilterRun.current) {
      firstFilterRun.current = false
      return
    }
    fetchBoardData(false)
  }, [debouncedFilters])

  useEffect(() => {
    if (!boardId) return
    return initBoardSocket(boardId, getBoardSocketCallbacks(setBoard, navigate))
  }, [boardId])

  // Cập nhật 1 column trong board theo cách immutable (các column khác giữ nguyên reference)
  const patchColumn = (columnId, updater) =>
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => (col._id === columnId ? updater(col) : col))
    }))

  const createNewColumn = async (newColumnData) => {
    if (!ensure(permissions.CREATE_COLUMN)) return
    const newColumn = await createNewColumnAPI({ ...newColumnData, boardId: board._id })
    const placeholder = generatePlaceholderCard(newColumn)
    setBoard((prev) => ({
      ...prev,
      columns: [...prev.columns, { ...newColumn, cards: [placeholder], cardOrderIds: [placeholder._id] }],
      columnOrderIds: [...prev.columnOrderIds, newColumn._id]
    }))
  }

  const createNewCard = async (newCardData) => {
    if (!ensure(permissions.CREATE_CARD, { blockWhileFiltering: true })) return
    try {
      const newCard = await createNewCardAPI({ ...newCardData, boardId: board._id })
      patchColumn(newCardData.columnId, (col) => {
        const hasPlaceholder = col.cards.some((card) => card.FE_PlaceholderCard)
        return hasPlaceholder
          ? { ...col, cards: [newCard], cardOrderIds: [newCard._id] }
          : { ...col, cards: [...col.cards, newCard], cardOrderIds: [...col.cardOrderIds, newCard._id] }
      })
    } catch (error) {
      toast.error('Lỗi khi tạo card')
    }
  }

  const moveColumns = async (dndOrderedColumns) => {
    if (!ensure(permissions.MOVING_COLUMN)) return
    const snapshot = { columns: board.columns, columnOrderIds: board.columnOrderIds }
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)

    setBoard((prev) => ({ ...prev, columns: dndOrderedColumns, columnOrderIds: dndOrderedColumnsIds }))

    try {
      const updatedBoard = await updateBoardDetailsAPI(board._id, { columnOrderIds: dndOrderedColumnsIds })
      if (updatedBoard?.columnOrderIds) {
        setBoard((prev) => ({
          ...prev,
          columns: mapOrder(prev.columns, updatedBoard.columnOrderIds, '_id'),
          columnOrderIds: updatedBoard.columnOrderIds
        }))
      }
    } catch (error) {
      toast.error('Lỗi khi di chuyển column')
      setBoard((prev) => ({ ...prev, ...snapshot }))
    }
  }

  const moverCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    if (!ensure(permissions.MOVING_CARD, { blockWhileFiltering: true })) return

    // Snapshot TRUOC khi keo. Do queue serialize, snapshot nay luon khop DB tai thoi diem
    // request duoc gui di (request truoc da xong).
    const cardOrderIdsBefore = board.columns.find((col) => col._id === columnId)?.cardOrderIds ?? []

    // Optimistic update UI ngay lap tuc
    patchColumn(columnId, (col) => ({ ...col, cards: dndOrderedCards, cardOrderIds: dndOrderedCardIds }))

    enqueueMove(() =>
      updateColumnDetailsAPI(columnId, {
        cardOrderIds: dndOrderedCardIds,
        cardOrderIdsBefore,
        boardId: board._id
      })
    )
  }

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    if (!ensure(permissions.MOVING_CARD, { blockWhileFiltering: true })) return

    // Bo placeholder ID (column trong dung placeholder card de hien thi)
    const clean = (ids) => (isPlaceholderId(ids?.[0]) ? [] : ids || [])

    // Snapshot TRUOC khi keo (lay tu state hien tai, do queue dam bao state = DB)
    const prevCardOrderIdsBefore = clean(board.columns.find((c) => c._id === prevColumnId)?.cardOrderIds)
    const nextCardOrderIdsBefore = clean(board.columns.find((c) => c._id === nextColumnId)?.cardOrderIds)

    // Optimistic update UI ngay
    setBoard((prev) => ({
      ...prev,
      columns: dndOrderedColumns,
      columnOrderIds: dndOrderedColumns.map((c) => c._id)
    }))

    // Thu tu SAU khi keo
    const prevCardOrderIdsAfter = clean(dndOrderedColumns.find((c) => c._id === prevColumnId)?.cardOrderIds)
    const nextCardOrderIdsAfter = clean(dndOrderedColumns.find((c) => c._id === nextColumnId)?.cardOrderIds)

    enqueueMove(() =>
      moveCardToDifferentColumnAPI({
        currentCardId,
        prevColumnId,
        prevCardOrderIdsBefore,
        prevCardOrderIdsAfter,
        nextColumnId,
        nextCardOrderIdsBefore,
        nextCardOrderIdsAfter,
        boardId: board._id
      })
    )
  }

  const deleteColumnDetails = async (columnId) => {
    if (!ensure(permissions.DELETE_COLUMN)) return
    try {
      setBoard((prev) => ({
        ...prev,
        columns: prev.columns.filter((c) => c._id !== columnId),
        columnOrderIds: prev.columnOrderIds.filter((id) => id !== columnId)
      }))
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
        fetchAllUserInBoard={fetchAllUserInBoard}
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
