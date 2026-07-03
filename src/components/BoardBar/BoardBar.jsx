import Box from '@mui/material/Box'
import FilterListIcon from '@mui/icons-material/FilterList'
import { RotateCcw } from 'lucide-react'
import MemberManage from './MemberManage'
import DialogChangeAdmin from './DialogChangeAdmin'
import FilterTable from './FilterTable'
import BoardTitle from './components/BoardTitle'
// VisibilityToggle tam an — hien tai chi ho tro PRIVATE, feature SHOWCASE/WORKSPACE lam sau.
// import VisibilityToggle from './components/VisibilityToggle'
import StarButton from './components/StarButton'
import BoardActionsMenu from './components/BoardActionsMenu'
import UserAvatars from './components/UserAvatars'
import { useBoardOperations } from './hooks/useBoardOperations'
import { useStarBoard } from './hooks/useStarBoard'
import { useMenuStates } from './hooks/useMenuStates'
import { textColor } from '~/utils/constants'

function BoardBar({
  board,
  setBoard,
  allUserInBoard,
  fetchAllUserInBoard,
  permissions,
  setFilters,
  filters,
  filterLoading
}) {
  const boardOps = useBoardOperations(board, setBoard)
  const starBoard = useStarBoard(board)
  const menuStates = useMenuStates()

  const hasActiveFilters = () => {
    return filters?.term || filters?.overdue || filters?.dueTomorrow || filters?.noDue
  }

  const handleResetFilters = () => {
    setFilters({
      term: '',
      overdue: '',
      dueTomorrow: '',
      noDue: ''
    })
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        px: 1,
        overflow: 'hidden',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333446' : 'transparent')
      }}
    >
      {/** Bên trái */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, pl: { xs: 1, sm: 2 }, minWidth: 0, overflow: 'hidden' }}>
        <BoardTitle
          isEditing={boardOps.isEditing}
          setIsEditing={boardOps.setIsEditing}
          editedTitle={boardOps.editedTitle}
          setEditedTitle={boardOps.setEditedTitle}
          boardTitle={board?.title}
          handleUpdateTitle={boardOps.handleUpdateTitle}
        />

        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <StarButton
            isStarred={starBoard.isStarred}
            handleStarBoard={starBoard.handleStarBoard}
            boardId={board._id}
            loading={starBoard.starLoading}
          />
        </Box>
      </Box>

      {/** Bên phải */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flexShrink: 0 }}>
        {/* Filter */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            onClick={(e) => menuStates.setAnchorFilter(e.currentTarget)}
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 34, height: 34, cursor: 'pointer', borderRadius: '4px',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' }
            }}
          >
            <FilterListIcon sx={{ color: textColor }} />
          </Box>

          {hasActiveFilters() && (
            <Box
              onClick={handleResetFilters}
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 34, height: 34, cursor: 'pointer', borderRadius: '4px',
                color: textColor,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' }
              }}
            >
              <RotateCcw size={16} />
            </Box>
          )}
        </Box>

        <FilterTable
          anchorFilter={menuStates.anchorFilter}
          setAnchorFilter={menuStates.setAnchorFilter}
          setFilters={setFilters}
          filters={filters}
          filterLoading={filterLoading}
        />

        <MemberManage board={board} allUserInBoard={allUserInBoard} fetchAllUserInBoard={fetchAllUserInBoard} />

        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <UserAvatars allUserInBoard={allUserInBoard} />
        </Box>

        <BoardActionsMenu
          anchorElMore={menuStates.anchorElMore}
          setAnchorElMore={menuStates.setAnchorElMore}
          board={board}
          permissions={permissions}
          handleChangStateBoard={boardOps.handleChangStateBoard}
          handleConfirmDeleteBoard={boardOps.handleConfirmDeleteBoard}
          handleConfirmLeaveBoard={boardOps.handleConfirmLeaveBoard}
          setOpenDialog={boardOps.setOpenDialog}
          isStarred={starBoard.isStarred}
          handleStarBoard={starBoard.handleStarBoard}
          allUserInBoard={allUserInBoard}
        />

        <DialogChangeAdmin
          open={boardOps.openDialog}
          onClose={() => boardOps.setOpenDialog(false)}
          board={board}
          allUserInBoard={allUserInBoard}
          setMemberId={boardOps.setMemberId}
          handleConfirmChangeAdmin={boardOps.handleConfirmChangeAdmin}
          memberId={boardOps.memberId}
        />
      </Box>
    </Box>
  )
}

export default BoardBar
