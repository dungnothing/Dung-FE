import Box from '@mui/material/Box'
import React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Settings from '@mui/icons-material/Settings'
import { Typography, ListItemText } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '~/redux/features/comon'

function Profiles() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.comon.user)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const logOut = () => {
    dispatch(logout())
    document.cookie = 'accessToken=; path=/; max-age=0'
    document.cookie = 'refreshToken=; path=/; max-age=0'
    navigate('/')
  }

  const profile = () => {
    navigate('/user/info')
  }

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar id="demo-positioned-button-profils" sx={{ width: 34, height: 34 }} src={user.avatar} />
        </IconButton>
      </Tooltip>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button-profils"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <Box sx={{ width: '250px', py: 1 }}>
          <Typography sx={{ fontWeight: 'bold', pl: '20px' }}>TÀI KHOẢN</Typography>
          <MenuItem onClick={profile} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ListItemIcon>
              <Avatar src={user.avatar} sx={{ width: 40, height: 40 }} />
            </ListItemIcon>
            <ListItemText
              sx={{
                '&:hover': {
                  color: '#07bc0c'
                }
              }}
            >
              {user.userName}
            </ListItemText>
          </MenuItem>

          <MenuItem onClick={handleClose}>
            <ListItemText sx={{ pl: '4px', '&:hover': { color: '#3498db' } }}>Cài đặt</ListItemText>
            <ListItemIcon>
              <Settings sx={{ width: 20, height: 20 }} />
            </ListItemIcon>
          </MenuItem>
          <Divider />
          <MenuItem onClick={logOut}>
            <ListItemText sx={{ pl: '4px', '&:hover': { color: '#e74c3c' } }}>Đăng xuất</ListItemText>
            <ListItemIcon>
              <LogoutIcon sx={{ width: 20, height: 20 }} />
            </ListItemIcon>
          </MenuItem>
        </Box>
      </Menu>
    </Box>
  )
}

export default Profiles
