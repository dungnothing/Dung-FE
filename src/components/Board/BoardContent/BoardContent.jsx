import {
  DndContext,
  DragOverlay,
  closestCorners,
  defaultDropAnimationSideEffects,
  getFirstCollision,
  pointerWithin,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Box from '@mui/material/Box'
import { cloneDeep } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { MouseSensor, TouchSensor } from '~/helpers/hooks/DndKitSensor'
import ListColumns from './ListColumns/ListColumns'
import { toast } from 'react-toastify'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'COLUMN',
  CARD: 'CARD'
}

function BoardContent({
  board,
  createNewColumn,
  createNewCard,
  moveColumns,
  moverCardInTheSameColumn,
  moveCardToDifferentColumn,
  deleteColumnDetails,
  fetchBoarData,
  permissions,
  setBoard,
  isFiltering
}) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }
  })

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 }
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  const [columns, setColumns] = useState([])

  const [activeDragId, setActiveDragId] = useState(null)
  const [activeDragType, setActiveDragType] = useState(null)
  const [activeDragData, setActiveDragData] = useState(null)
  const [oldColumn, setOldColumn] = useState(null) // oldColumnWhenDraggingCard

  useEffect(() => {
    setColumns(board?.columns || [])
  }, [board])

  const isBoardClosed = board?.boardState === 'CLOSED'

  const findContainer = (id) => {
    const asColumn = columns.find((column) => column._id === id)
    if (asColumn) return asColumn
    return columns.find((column) => column?.cards?.some((card) => card._id === id))
  }

  // Chi Owner/Admin (permissions.LOCK_COLUMN) moi thao tac duoc card trong column bi khoa
  const canBypassLock = permissions?.LOCK_COLUMN
  const isColumnBlocked = (column) => column?.isLocked && !canBypassLock

  const moveCardBetweenDifferentColumns = (
    targetColumn,
    targetCardId,
    active,
    over,
    sourceCol,
    draggingCardId,
    draggingCardData,
    triggerFrom
  ) => {
    setColumns((prevColumns) => {
      const overCardIndex = targetColumn?.cards?.findIndex((card) => card._id === targetCardId)

      let newCardIndex
      const isBelowOverItem =
        active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : targetColumn?.cards?.length + 1

      const nextColumns = cloneDeep(prevColumns)
      const source = nextColumns.find((column) => column._id === sourceCol._id)
      const target = nextColumns.find((column) => column._id === targetColumn._id)

      if (source) {
        source.cards = source.cards.filter((card) => card._id !== draggingCardId)

        source.cardOrderIds = source.cards.map((card) => card._id)
      }

      if (target) {
        target.cards = target.cards.filter((card) => card._id !== draggingCardId)

        const rebuiltCard = {
          ...draggingCardData,
          columnId: target._id
        }

        target.cards = target.cards.toSpliced(newCardIndex, 0, rebuiltCard)

        target.cards = target.cards.filter((card) => !card.FE_PlaceholderCard)

        target.cardOrderIds = target.cards.map((card) => card._id)
      }

      if (triggerFrom === 'handleDragEnd') {
        moveCardToDifferentColumn(draggingCardId, oldColumn._id, target._id, nextColumns)
      }

      return nextColumns
    })
  }

  const handleDragStart = (event) => {
    setActiveDragId(event?.active?.id)
    setActiveDragType(event?.active?.data?.current?.type)
    setActiveDragData(event?.active?.data?.current)

    if (!event?.active?.data?.current?.cardOrderIds) {
      setOldColumn(findContainer(event?.active?.id))
    }
  }

  const handleDragOver = (event) => {
    if (!event?.active || !event?.over) return
    if (activeDragType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over } = event

    if (!active || !over) return

    const draggingCardId = active.id
    const overCardId = over.id

    const sourceCol = findContainer(draggingCardId)
    const targetCol = findContainer(overCardId)

    if (!sourceCol || !targetCol) return

    // Khong preview keo qua/ra khoi column bi khoa (tru Owner/Admin)
    if (isColumnBlocked(sourceCol) || isColumnBlocked(targetCol)) return

    if (sourceCol._id !== targetCol._id) {
      moveCardBetweenDifferentColumns(
        targetCol,
        overCardId,
        active,
        over,
        sourceCol,
        draggingCardId,
        activeDragData,
        'handleDragOver'
      )
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over) {
      setActiveDragId(null)
      setActiveDragType(null)
      setActiveDragData(null)
      setOldColumn(null)
      return
    }

    if (activeDragType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      if (!permissions.MOVING_CARD) {
        toast.error('Bạn không có quyền')
        setColumns(board?.columns || [])
        setActiveDragId(null)
        setActiveDragType(null)
        setActiveDragData(null)
        setOldColumn(null)
        return
      }

      if (isFiltering) {
        toast.error('Không thể thực hiện khi đang lọc')
        setColumns(board?.columns || [])
        setActiveDragId(null)
        setActiveDragType(null)
        setActiveDragData(null)
        setOldColumn(null)
        return
      }

      const draggingCardId = active.id
      const overCardId = over.id

      const sourceCol = findContainer(draggingCardId)
      const targetCol = findContainer(overCardId)
      if (!sourceCol || !targetCol) return

      // Column nguon (luc bat dau keo) hoac column dich dang bi khoa -> chan hoan tac,
      // reset ve dung vi tri cu (phong truong hop handleDragOver chua kip chan).
      if (isColumnBlocked(oldColumn) || isColumnBlocked(sourceCol) || isColumnBlocked(targetCol)) {
        toast.error('Cột đã bị khoá — không thể di chuyển thẻ')
        setColumns(board?.columns || [])
        setActiveDragId(null)
        setActiveDragType(null)
        setActiveDragData(null)
        setOldColumn(null)
        return
      }

      if (oldColumn._id !== targetCol._id) {
        moveCardBetweenDifferentColumns(
          targetCol,
          overCardId,
          active,
          over,
          sourceCol,
          draggingCardId,
          activeDragData,
          'handleDragEnd'
        )
      } else {
        const oldIndex = oldColumn?.cards?.findIndex((c) => c._id === activeDragId)
        const newIndex = targetCol?.cards?.findIndex((c) => c._id === overCardId)
        if (oldIndex === newIndex) return

        const newOrderedCards = arrayMove(oldColumn?.cards, oldIndex, newIndex)
        const newOrderedIds = newOrderedCards.map((card) => card._id)

        setColumns((prev) => {
          const next = cloneDeep(prev)
          const col = next.find((c) => c._id === targetCol._id)
          col.cards = newOrderedCards
          col.cardOrderIds = newOrderedIds
          return next
        })

        moverCardInTheSameColumn(newOrderedCards, newOrderedIds, oldColumn._id)
      }
    }

    if (activeDragType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (!permissions.MOVING_COLUMN) {
        toast.error('Bạn không có quyền')
        return
      }
      if (active.id !== over.id) {
        const oldIndex = columns.findIndex((c) => c._id === active.id)
        const newIndex = columns.findIndex((c) => c._id === over.id)
        const newOrderedColumns = arrayMove(columns, oldIndex, newIndex)
        setColumns(newOrderedColumns)
        moveColumns(newOrderedColumns)
      }
    }

    setActiveDragId(null)
    setActiveDragType(null)
    setActiveDragData(null)
    setOldColumn(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: 0.5 } }
    })
  }

  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }

      const pointerIntersections = pointerWithin(args)

      if (!pointerIntersections?.length) return

      let overId = getFirstCollision(pointerIntersections, 'id')

      if (overId) {
        const checkColumn = columns.find((column) => column._id === overId)
        if (checkColumn) {
          const nearestCardId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter((container) => {
              return container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
            })
          })[0]?.id
          overId = nearestCardId ?? overId
        }
        return [{ id: overId }]
      }
    },
    [activeDragType, columns]
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragEnd={isBoardClosed ? undefined : handleDragEnd}
      onDragOver={isBoardClosed ? undefined : handleDragOver}
      onDragStart={isBoardClosed ? undefined : handleDragStart}
    >
      {isBoardClosed && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#4D55CC' : '#e9f2ff'),
            p: 0.5
          }}
        >
          Bạn chỉ có thể xem nội dung này!
        </Box>
      )}
      <Box
        sx={{
          backgroundImage: `url(${board?.boardBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          pt: '12px',
          opacity: 0.95,
          pointerEvents: 'auto',
          userSelect: isBoardClosed ? 'none' : 'auto',
          position: 'relative'
        }}
      >
        <ListColumns
          board={board}
          columns={columns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
          deleteColumnDetails={deleteColumnDetails}
          boardState={board?.boardState}
          isBoardClosed={isBoardClosed}
          fetchBoarData={fetchBoarData}
          permissions={permissions}
          setBoard={setBoard}
        />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragType && null}
          {activeDragType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragData} isOverlay />}
          {activeDragType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragData} isOverlay />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
