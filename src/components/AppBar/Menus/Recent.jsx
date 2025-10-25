import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal'
import { useNavigate } from 'react-router-dom'
import { textColor } from '~/utils/constants'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import Typography from '@mui/material/Typography'
import EmptyList from '~/helpers/components/EmptyPage'

function Recent() {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)
  const recentBoards = useSelector((state) => state.comon.recentBoards)
  const handleClose = () => {
    setAnchorEl(null)
    setOpen(false)
  }

  return (
    <Box sx={{ whiteSpace: 'nowrap' }}>
      <Button
        sx={{ color: textColor }}
        onClick={(event) => {
          setAnchorEl(anchorEl ? null : event.currentTarget)
          setOpen(!open)
        }}
        endIcon={<ExpandMoreIcon sx={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />}
      >
        Gần đây
      </Button>
      <Menu
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
        <Box sx={{ minWidth: '240px', display: 'flex', flexDirection: 'column', gap: 1, p: 1 }}>
          <Typography variant="body3" sx={{ pl: 2, opacity: 0.65, color: textColor }}>
            Bảng gần đây truy cập
          </Typography>
          {recentBoards?.length === 0 ? (
            <EmptyList title="Không có bảng gần đây" size={60} height={100} />
          ) : (
            recentBoards?.map((board) => (
              <MenuItem
                key={board._id}
                onClick={() => {
                  navigate(`/boards/${board._id}`)
                  handleClose()
                }}
              >
                <ListItemIcon>
                  <AutoFixNormalIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText sx={{ color: textColor }}>{board.title}</ListItemText>
              </MenuItem>
            ))
          )}
        </Box>
      </Menu>
    </Box>
  )
}

export default Recent
