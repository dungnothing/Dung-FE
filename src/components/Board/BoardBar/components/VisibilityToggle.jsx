import { Box, Tooltip, Menu, MenuItem, ListItemText, Typography, IconButton } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import PublicIcon from '@mui/icons-material/Public'
import DoneIcon from '@mui/icons-material/Done'
import { textColor } from '~/utils/constants'

function VisibilityToggle({ visibility, setVisibility, anchorEl, setAnchorEl, open, setOpen, handleVisibilityChange }) {
  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget)
    setOpen(true)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setOpen(false)
  }

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Tooltip title="Trạng thái xem" placement="bottom">
          {visibility === 'PRIVATE' ? <LockIcon sx={{ color: textColor }} /> : <PublicIcon sx={{ color: textColor }} />}
        </Tooltip>
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} slotProps={{ paper: { sx: { width: '450px' } } }}>
        <MenuItem
          sx={{ maxWidth: '450px' }}
          onClick={() => {
            handleVisibilityChange(false)
            setVisibility('PUBLIC')
            handleClose()
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PublicIcon fontSize="small" />
              <ListItemText>Public</ListItemText>
              {visibility === 'PUBLIC' && <DoneIcon fontSize="small" />}
            </Box>
            <Typography
              sx={{
                width: '100%',
                wordBreak: 'break-word',
                whiteSpace: 'normal'
              }}
            >
              Bất kì ai sử dụng web này đều có thể nhìn thấy. Chỉ thành viên nhóm mới được chỉnh sửa.
            </Typography>
          </Box>
        </MenuItem>

        <MenuItem
          sx={{ maxWidth: '450px' }}
          onClick={() => {
            handleVisibilityChange(true)
            setVisibility('PRIVATE')
            handleClose()
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LockIcon fontSize="small" />
              <ListItemText sx={{ width: '100%' }}>Private</ListItemText>
              {visibility === 'PRIVATE' && <DoneIcon fontSize="small" />}
            </Box>
            <Typography>Chỉ thành viên bảng mới được xem.</Typography>
          </Box>
        </MenuItem>
      </Menu>
    </>
  )
}

export default VisibilityToggle
