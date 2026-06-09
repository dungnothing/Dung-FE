import {
  Box, IconButton, Menu, MenuItem, Drawer, Typography, Divider,
  Avatar, AvatarGroup, Tooltip, List, ListItemButton, ListItemIcon, ListItemText,
  useMediaQuery, useTheme
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import StarIcon from '@mui/icons-material/Star'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import LockIcon from '@mui/icons-material/Lock'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { ChevronsUp } from 'lucide-react'
import { textColor } from '~/utils/constants'
import { useState } from 'react'

function BoardActionsMenu({
  anchorElMore,
  setAnchorElMore,
  board,
  permissions,
  handleChangStateBoard,
  handleConfirmDeleteBoard,
  setOpenDialog,
  isStarred,
  handleStarBoard,
  allUserInBoard
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleOpen = (e) => {
    if (isMobile) setDrawerOpen(true)
    else setAnchorElMore(e.currentTarget)
  }

  const closeAll = () => {
    setDrawerOpen(false)
    setAnchorElMore(null)
  }

  const isClosed = board?.boardState !== 'OPEN'

  return (
    <Box>
      <IconButton onClick={handleOpen}>
        <MoreVertIcon sx={{ color: textColor }} />
      </IconButton>

      {/* Desktop: Menu cũ */}
      <Menu anchorEl={anchorElMore} open={Boolean(anchorElMore)} onClose={() => setAnchorElMore(null)}>
        <MenuItem onClick={() => { handleChangStateBoard(); setAnchorElMore(null) }}>
          {isClosed ? 'Mở cửa trái tim' : 'Đóng cửa trái tim'}
        </MenuItem>
        <MenuItem disabled={!permissions?.DELETE_BOARD} onClick={() => { handleConfirmDeleteBoard(); setAnchorElMore(null) }}>
          Xóa bảng
        </MenuItem>
        <MenuItem disabled={!permissions?.CHANGE_ADMIN} onClick={() => { setOpenDialog(true); setAnchorElMore(null) }}>
          Thay đổi admin
        </MenuItem>
      </Menu>

      {/* Mobile: Drawer từ dưới */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              pt: 1,
              pb: 2
            }
          }
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 1, pb: 1 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}>
            Tuỳ chọn bảng
          </Typography>
          <IconButton size="small" onClick={() => setDrawerOpen(false)}>
            <MoreVertIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Board name */}
        <Box sx={{ px: 2, pb: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: textColor, mb: 0.5 }}>
            {board?.title}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {isClosed ? '🔒 Bảng đã đóng' : '🟢 Bảng đang mở'}
          </Typography>
        </Box>

        {/* Members */}
        {allUserInBoard && (
          <>
            <Divider />
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="caption" fontWeight={600} sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Thành viên
              </Typography>
              <Box sx={{ mt: 1, position: 'relative', display: 'inline-flex' }}>
                <AvatarGroup
                  max={7}
                  sx={{ '& .MuiAvatar-root': { width: 36, height: 36, fontSize: 14, border: '2px solid #fff' } }}
                >
                  <Tooltip title={allUserInBoard.admin?.adminName + ' (Admin)'}>
                    <Avatar src={allUserInBoard.admin?.adminAvatar} alt={allUserInBoard.admin?.adminName} />
                  </Tooltip>
                  {allUserInBoard.members?.map((m, i) => (
                    <Tooltip key={i} title={m.memberName}>
                      <Avatar src={m.memberAvatar} alt={m.memberName} />
                    </Tooltip>
                  ))}
                </AvatarGroup>
                <Box sx={{ position: 'absolute', top: -4, left: 22, zIndex: 10 }}>
                  <ChevronsUp strokeWidth={4} color="#172b4d" size={14} />
                </Box>
              </Box>
            </Box>
          </>
        )}

        <Divider />

        {/* Actions */}
        <List disablePadding>
          <ListItemButton onClick={() => { handleStarBoard?.(); closeAll() }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              {isStarred
                ? <StarIcon sx={{ color: '#F5A623', fontSize: 20 }} />
                : <StarOutlineIcon sx={{ fontSize: 20 }} />}
            </ListItemIcon>
            <ListItemText primary={isStarred ? 'Bỏ gắn sao' : 'Gắn sao bảng'} />
          </ListItemButton>

          <ListItemButton onClick={() => { handleChangStateBoard(); closeAll() }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              {isClosed
                ? <LockOpenIcon sx={{ fontSize: 20 }} />
                : <LockIcon sx={{ fontSize: 20 }} />}
            </ListItemIcon>
            <ListItemText primary={isClosed ? 'Mở cửa trái tim' : 'Đóng cửa trái tim'} />
          </ListItemButton>

          <ListItemButton disabled={!permissions?.CHANGE_ADMIN} onClick={() => { setOpenDialog(true); closeAll() }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <AdminPanelSettingsIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Thay đổi admin" />
          </ListItemButton>

          <ListItemButton
            disabled={!permissions?.DELETE_BOARD}
            onClick={() => { handleConfirmDeleteBoard(); closeAll() }}
            sx={{ color: 'error.main', '& .MuiListItemIcon-root': { color: 'error.main' } }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <DeleteOutlineIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Xóa bảng" />
          </ListItemButton>
        </List>
      </Drawer>
    </Box>
  )
}

export default BoardActionsMenu
