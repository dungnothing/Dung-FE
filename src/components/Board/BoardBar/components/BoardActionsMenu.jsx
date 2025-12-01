import { Box, Menu, MenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { textColor } from '~/utils/constants'

function BoardActionsMenu({
  anchorElMore,
  setAnchorElMore,
  board,
  permissions,
  handleChangStateBoard,
  handleConfirmDeleteBoard,
  setOpenDialog
}) {
  return (
    <Box>
      <MoreVertIcon sx={{ color: textColor, cursor: 'pointer' }} onClick={(e) => setAnchorElMore(e.currentTarget)} />
      <Menu
        anchorEl={anchorElMore}
        open={Boolean(anchorElMore)}
        onClose={() => setAnchorElMore(null)}
        disableRestoreFocus
      >
        <MenuItem
          onClick={() => {
            handleChangStateBoard()
            setAnchorElMore(null)
          }}
        >
          {board?.boardState === 'OPEN' ? 'Đóng cửa trái tim' : 'Mở cửa trái tim'}
        </MenuItem>
        <MenuItem
          disabled={!permissions?.DELETE_BOARD}
          onClick={() => {
            handleConfirmDeleteBoard()
            setAnchorElMore(null)
          }}
        >
          Xóa bảng
        </MenuItem>
        <MenuItem
          disabled={!permissions?.CHANGE_ADMIN}
          onClick={() => {
            setOpenDialog(true)
            setAnchorElMore(null)
          }}
        >
          Thay đổi admin
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default BoardActionsMenu
