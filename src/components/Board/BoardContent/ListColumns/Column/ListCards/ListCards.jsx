import Card from './Card/Card'
import Box from '@mui/material/Box'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

function ListCards({ board, cards, boardState, fetchBoarData, setBoard }) {
  return (
    <SortableContext items={cards?.map((c) => c._id) || []} strategy={verticalListSortingStrategy}>
      <Box
        sx={{
          p: '0 5px 5px 5px',
          m: '0 5px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: 1,
          overflowX: 'hidden',
          overflowY: 'auto',
          maxHeight: (theme) =>
            `calc(
              ${theme.trello.boardContentHeight} -
              ${theme.spacing(5)} -
              ${theme.trello.columnHeaderHeight} -
              ${theme.trello.columnFooterHeight}
            )`,
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced0da' },
          '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#bfc2cf' }
        }}
      >
        {cards?.map((card) => (
          <Card
            board={board}
            key={card._id}
            card={card}
            boardState={boardState}
            fetchBoarData={fetchBoarData}
            setBoard={setBoard}
          />
        ))}
      </Box>
    </SortableContext>
  )
}

export default ListCards
