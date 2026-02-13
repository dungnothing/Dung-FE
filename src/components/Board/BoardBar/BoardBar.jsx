import Box from '@mui/material/Box'
import FilterListIcon from '@mui/icons-material/FilterList'
import { RotateCcw } from 'lucide-react'
import MemberManage from './MemberManage'
import DialogChangeAdmin from './DialogChangeAdmin'
import FilterTable from './FilterTable'
import BoardTitle from './components/BoardTitle'
import VisibilityToggle from './components/VisibilityToggle'
import StarButton from './components/StarButton'
import BoardActionsMenu from './components/BoardActionsMenu'
import UserAvatars from './components/UserAvatars'
import { useBoardOperations } from './hooks/useBoardOperations'
import { useStarBoard } from './hooks/useStarBoard'
import { useMenuStates } from './hooks/useMenuStates'
import { textColor } from '~/utils/constants'

function BoardBar({ board, setBoard, allUserInBoard, permissions, setFilters, filters, filterLoading }) {
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
        paddingX: 1,
        overflowX: 'auto',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333446' : 'transparent'),
        '&::-webkit-scrollbar-track': { m: 1 }
      }}
    >
      {/** Bên trái */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ pl: 2, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 2 }}>
          <BoardTitle
            isEditing={boardOps.isEditing}
            setIsEditing={boardOps.setIsEditing}
            editedTitle={boardOps.editedTitle}
            setEditedTitle={boardOps.setEditedTitle}
            boardTitle={board?.title}
            handleUpdateTitle={boardOps.handleUpdateTitle}
          />

          <VisibilityToggle
            visibility={boardOps.visibility}
            anchorEl={menuStates.anchorEl}
            setAnchorEl={menuStates.setAnchorEl}
            open={menuStates.open}
            setOpen={menuStates.setOpen}
            handleVisibilityChange={boardOps.handleVisibilityChange}
            loading={boardOps.visibilityLoading}
          />

          <StarButton
            isStarred={starBoard.isStarred}
            handleStarBoard={starBoard.handleStarBoard}
            boardId={board._id}
            loading={starBoard.starLoading}
          />
        </Box>
      </Box>

      {/** Bên phải */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Filter Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box
            onClick={(e) => {
              menuStates.setAnchorFilter(e.currentTarget)
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              width: 34,
              height: 34,
              justifyContent: 'center',
              '&:hover': {
                bgcolor: '#DCDFE4'
              },
              '&:active': {
                bgcolor: '#DCDFE4'
              },
              px: 1
            }}
          >
            <FilterListIcon sx={{ color: textColor }} />
          </Box>

          {/* Reset Filter Button - Only show when filters are active */}
          {hasActiveFilters() && (
            <Box
              onClick={handleResetFilters}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                width: 34,
                height: 34,
                color: textColor,
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: '#DCDFE4'
                },
                '&:active': {
                  bgcolor: '#DCDFE4'
                },
                px: 1
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

        {/*  Invite */}
        <MemberManage board={board} allUserInBoard={allUserInBoard} />

        {/*  Avatar */}
        <UserAvatars allUserInBoard={allUserInBoard} />

        {/*  Board Actions Menu */}
        <BoardActionsMenu
          anchorElMore={menuStates.anchorElMore}
          setAnchorElMore={menuStates.setAnchorElMore}
          board={board}
          permissions={permissions}
          handleChangStateBoard={boardOps.handleChangStateBoard}
          handleConfirmDeleteBoard={boardOps.handleConfirmDeleteBoard}
          setOpenDialog={boardOps.setOpenDialog}
        />

        {/* Dialog thay đổi admin */}
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
