import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import {
  DndContext,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/helpers/hooks/DndKitSensor'
import { useCallback, useEffect, useRef, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { toast } from 'react-toastify'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
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

  const lastOverId = useRef(null)

  useEffect(() => {
    setColumns(board?.columns || [])
  }, [board])

  const findColumnByCardId = (cardId) => {
    return columns.find((column) => column?.cards?.map((card) => card._id)?.includes(cardId))
  }

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

        if (isEmpty(source.cards)) {
          source.cards = [generatePlaceholderCard(source)]
        }

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
    setActiveDragType(
      event?.active?.data?.current?.cardOrderIds ? ACTIVE_DRAG_ITEM_TYPE.COLUMN : ACTIVE_DRAG_ITEM_TYPE.CARD
    )
    setActiveDragData(event?.active?.data?.current)

    if (!event?.active?.data?.current?.cardOrderIds) {
      setOldColumn(findColumnByCardId(event?.active?.id))
    }
  }

  const handleDragOver = (event) => {
    if (!event?.active || !event?.over) return
    if (activeDragType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over } = event
    if (!active || !over) return

    const draggingCardId = active.id
    const overCardId = over.id

    const sourceCol = findColumnByCardId(draggingCardId)
    const targetCol = findColumnByCardId(overCardId)

    if (!sourceCol || !targetCol) return

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
        return
      }

      if (isFiltering) {
        toast.error('Không thể thực hiện khi đang lọc')
        return
      }

      const draggingCardId = active.id
      const overCardId = over.id

      const sourceCol = findColumnByCardId(draggingCardId)
      const targetCol = findColumnByCardId(overCardId)
      if (!sourceCol || !targetCol) return

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
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter((container) => {
              return container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
            })
          })[0]?.id
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragType, columns]
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
    >
      {board?.boardState === 'CLOSED' && (
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
          p: '10px 0',
          opacity: 0.95,
          pointerEvents: board?.boardState === 'CLOSE' ? 'none' : 'auto',
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
