import { Box, IconButton, Menu, MenuItem, Divider, Avatar, AvatarGroup, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'
import { textColor } from '~/utils/constants'

function BoardActionsMenu({
  anchorElMore,
  setAnchorElMore,
  board,
  permissions,
  handleChangStateBoard,
  handleConfirmDeleteBoard,
  setOpenDialog,
  // mobile extras
  isStarred,
  handleStarBoard,
  allUserInBoard
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box>
      <IconButton onClick={(e) => setAnchorElMore(e.currentTarget)}>
        <MoreVertIcon sx={{ color: textColor, cursor: 'pointer' }} />
      </IconButton>
      <Menu anchorEl={anchorElMore} open={Boolean(anchorElMore)} onClose={() => setAnchorElMore(null)}>

        {/* Trên mobile: hiển thị star + members trong menu */}
        {isMobile && [
          <MenuItem key="star" onClick={() => { handleStarBoard?.(); setAnchorElMore(null) }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isStarred
                ? <StarIcon sx={{ fontSize: 18, color: '#F5A623' }} />
                : <StarBorderIcon sx={{ fontSize: 18 }} />}
              <Typography variant="body2">{isStarred ? 'Bỏ gắn sao' : 'Gắn sao bảng'}</Typography>
            </Box>
          </MenuItem>,

          allUserInBoard && (
            <MenuItem key="members" disableRipple sx={{ cursor: 'default', '&:hover': { bgcolor: 'transparent' } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Thành viên
                </Typography>
                <AvatarGroup max={6} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 12 } }}>
                  <Tooltip title={allUserInBoard.admin?.adminName + ' (Admin)'}>
                    <Avatar src={allUserInBoard.admin?.adminAvatar} alt={allUserInBoard.admin?.adminName} />
                  </Tooltip>
                  {allUserInBoard.members?.map((m, i) => (
                    <Tooltip key={i} title={m.memberName}>
                      <Avatar src={m.memberAvatar} alt={m.memberName} />
                    </Tooltip>
                  ))}
                </AvatarGroup>
              </Box>
            </MenuItem>
          ),

          <Divider key="divider" />
        ]}

        <MenuItem onClick={() => { handleChangStateBoard(); setAnchorElMore(null) }}>
          {board?.boardState === 'OPEN' ? 'Đóng cửa trái tim' : 'Mở cửa trái tim'}
        </MenuItem>
        <MenuItem
          disabled={!permissions?.DELETE_BOARD}
          onClick={() => { handleConfirmDeleteBoard(); setAnchorElMore(null) }}
        >
          Xóa bảng
        </MenuItem>
        <MenuItem
          disabled={!permissions?.CHANGE_ADMIN}
          onClick={() => { setOpenDialog(true); setAnchorElMore(null) }}
        >
          Thay đổi admin
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default BoardActionsMenu
