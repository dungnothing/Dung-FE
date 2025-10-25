import Box from '@mui/material/Box'
import React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Avatar from '@mui/material/Avatar'
import { textColor } from '~/utils/constants'
import { useNavigate } from 'react-router-dom'

function Template() {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleGoToTemplate = () => {
    setAnchorEl(null)
    navigate('/dashboard?tab=TemplateTop')
  }

  return (
    <Box sx={{ whiteSpace: 'nowrap' }}>
      <Button
        sx={{ color: textColor }}
        id="demo-positioned-button-template"
        aria-controls={open ? 'demo-positioned-menu-template' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon sx={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />}
      >
        Mẫu
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button-template"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <Box sx={{ width: '300px' }}>
          <ListItemText
            display='flex'
            sx={{
              alignItems: 'center',
              opacity: '0.65',
              width: '100%',
              paddingLeft: '50px',
              color: textColor
            }}>
            Top Template
          </ListItemText>
          <MenuItem onClick={handleGoToTemplate}>
            <ListItemIcon>
              <Avatar
                alt="mau 1"
                src="https://i.pinimg.com/736x/a5/a4/2f/a5a42f03f100acf392ba778e07fabb68.jpg"
                sx={{ width: 40, height: 40 }}
              />
            </ListItemIcon>
            <ListItemText sx={{ paddingLeft: '10px', justifyContent: 'center', color: textColor }} >Kế hoạch hàng ngày</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleGoToTemplate}>
            <ListItemIcon>
              <Avatar
                alt="mau 2"
                src="https://i.pinimg.com/736x/7e/89/71/7e89712cb01610d1ee6f6d9973bb554f.jpg"
                sx={{ width: 40, height: 40 }}
              />
            </ListItemIcon>
            <ListItemText sx={{ paddingLeft: '10px', justifyContent: 'center', color: textColor }}>Học tập</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleGoToTemplate}>
            <ListItemIcon>
              <Avatar
                alt="mau 3"
                src="https://i.pinimg.com/736x/f6/bb/f2/f6bbf22b751973649b3a6b827330c9dd.jpg"
                sx={{ width: 40, height: 40 }}
              />
            </ListItemIcon>
            <ListItemText sx={{ paddingLeft: '10px', justifyContent: 'center', color: textColor }}>Quản lý dự án</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleGoToTemplate}>
            <ListItemIcon>
              <Avatar
                alt="mau 4"
                src="https://i.pinimg.com/736x/be/5e/bf/be5ebf45462b15ea01d59f5597b23b67.jpg"
                sx={{ width: 40, height: 40 }}
              />
            </ListItemIcon>
            <ListItemText sx={{ paddingLeft: '10px', justifyContent: 'center', color: textColor }}>Sổ tay nhân viên</ListItemText>
          </MenuItem>
        </Box>
      </Menu>
    </Box>
  )
}

export default Template
