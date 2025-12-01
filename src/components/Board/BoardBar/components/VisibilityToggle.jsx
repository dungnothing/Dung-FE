import { Box, Tooltip, Menu, MenuItem, ListItemText, Typography } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import PublicIcon from '@mui/icons-material/Public'
import DoneIcon from '@mui/icons-material/Done'
import { textColor } from '~/utils/constants'

function VisibilityToggle({ visibility, setVisibility, anchorEl, setAnchorEl, open, setOpen, handleVisibilityChange }) {
  return (
    <>
      <Box
        ref={(el) => setAnchorEl(el)}
        sx={{
          bgcolor: open ? '#DCDFE4' : 'transparent',
          width: '30px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setOpen(!open)}
      >
        <Tooltip title="Trạng thái xem" placement="bottom">
          {visibility === 'PRIVATE' ? <LockIcon sx={{ color: textColor }} /> : <PublicIcon sx={{ color: textColor }} />}
        </Tooltip>
      </Box>

      <Menu
        disableRestoreFocus
        anchorEl={anchorEl}
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <Box sx={{ width: '400px' }}>
          <MenuItem
            sx={{ whiteSpace: 'normal' }}
            onClick={() => {
              handleVisibilityChange(false)
              setVisibility('PUBLIC')
              setOpen(false)
            }}
          >
            <Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                <PublicIcon fontSize="small" />
                <ListItemText sx={{ marginLeft: '10px' }}>Public</ListItemText>
                {visibility === 'PUBLIC' && <DoneIcon fontSize="small" />}
              </Box>
              <Box>
                <Typography>
                  Bất kì ai sử dụng web này đều có thể nhìn thấy. Chỉ thành viên trong nhóm mới có thể chỉnh sửa
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <MenuItem
            sx={{ whiteSpace: 'normal' }}
            onClick={() => {
              handleVisibilityChange(true)
              setVisibility('PRIVATE')
              setOpen(false)
            }}
          >
            <Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                <LockIcon fontSize="small" />
                <ListItemText sx={{ marginLeft: '10px' }}>Private</ListItemText>
                {visibility === 'PRIVATE' && <DoneIcon fontSize="small" />}
              </Box>
              <Box>
                <Typography>
                  Chỉ thành viên của bảng này mới được xem. Chủ bảng có thể tắt chỉnh sửa thông tin và thêm xóa thành
                  viên
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        </Box>
      </Menu>
    </>
  )
}

export default VisibilityToggle
