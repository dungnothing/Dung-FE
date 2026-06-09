import {
  Box, IconButton, Menu, MenuItem, Drawer, Typography, Divider,
  Avatar, Chip, List, ListItemButton, ListItemIcon, ListItemText,
  useMediaQuery, useTheme
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import StarIcon from '@mui/icons-material/Star'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import LockIcon from '@mui/icons-material/Lock'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import CloseIcon from '@mui/icons-material/Close'
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

      {/* Mobile: Drawer từ phải */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: { width: 280, display: 'flex', flexDirection: 'column' }
          }
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 2, pb: 1.5 }}>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: textColor, lineHeight: 1.2 }}>
              {board?.title}
            </Typography>
            <Chip
              size="small"
              label={isClosed ? 'Đã đóng' : 'Đang mở'}
              sx={{
                mt: 0.5,
                height: 20,
                fontSize: '0.7rem',
                bgcolor: isClosed ? 'error.lighter' : '#e3fcef',
                color: isClosed ? 'error.main' : '#006644',
                fontWeight: 600
              }}
            />
          </Box>
          <IconButton size="small" onClick={() => setDrawerOpen(false)} sx={{ color: 'text.secondary' }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <Divider />

        {/* Members */}
        {allUserInBoard && (
          <>
            <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
              <Typography variant="caption" fontWeight={600} sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1 }}>
                Thành viên
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Admin */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar src={allUserInBoard.admin?.adminAvatar} alt={allUserInBoard.admin?.adminName} sx={{ width: 32, height: 32, fontSize: 13 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: textColor, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {allUserInBoard.admin?.adminName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Quản trị viên</Typography>
                  </Box>
                  <Chip size="small" label="Admin" sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#635FFF', color: '#fff', fontWeight: 600 }} />
                </Box>
                {/* Members */}
                {allUserInBoard.members?.map((m, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar src={m.memberAvatar} alt={m.memberName} sx={{ width: 32, height: 32, fontSize: 13 }} />
                    <Typography variant="body2" sx={{ color: textColor, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.memberName}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <Divider />
          </>
        )}

        {/* Actions */}
        <List disablePadding sx={{ pt: 0.5 }}>
          <ListItemButton onClick={() => { handleStarBoard?.(); closeAll() }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              {isStarred
                ? <StarIcon sx={{ color: '#F5A623', fontSize: 20 }} />
                : <StarOutlineIcon sx={{ fontSize: 20 }} />}
            </ListItemIcon>
            <ListItemText primary={isStarred ? 'Bỏ gắn sao' : 'Gắn sao bảng'} primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>

          <ListItemButton onClick={() => { handleChangStateBoard(); closeAll() }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              {isClosed
                ? <LockOpenIcon sx={{ fontSize: 20 }} />
                : <LockIcon sx={{ fontSize: 20 }} />}
            </ListItemIcon>
            <ListItemText primary={isClosed ? 'Mở cửa trái tim' : 'Đóng cửa trái tim'} primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>

          <ListItemButton disabled={!permissions?.CHANGE_ADMIN} onClick={() => { setOpenDialog(true); closeAll() }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <AdminPanelSettingsIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Thay đổi admin" primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>

          <ListItemButton
            disabled={!permissions?.DELETE_BOARD}
            onClick={() => { handleConfirmDeleteBoard(); closeAll() }}
            sx={{ color: 'error.main', '& .MuiListItemIcon-root': { color: 'error.main' } }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <DeleteOutlineIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Xóa bảng" primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>
        </List>
      </Drawer>
    </Box>
  )
}

export default BoardActionsMenu
