import Box from '@mui/material/Box'
import { useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import { textColor } from '~/utils/constants'
import { useSelector } from 'react-redux'
import StarIcon from '@mui/icons-material/Star'
import { addRecentBoardAPI } from '~/apis/boards'
import { toast } from 'react-toastify'

function Starred() {
  const [anchorEl, setAnchorEl] = useState(null)
  const starredBoards = useSelector((state) => state.comon.starBoards)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleGoToBoardStarred = async (boardId) => {
    try {
      await addRecentBoardAPI(boardId)
      navigate(`/boards/${boardId}`)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải bảng')
    }
  }

  return (
    <Box sx={{ whiteSpace: 'nowrap' }}>
      <Button
        sx={{ color: textColor }}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon sx={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />}
      >
        Đã đánh dấu
      </Button>
      <Menu
        sx={{ minWidth: '200px', minHeight: '200px' }}
        anchorEl={anchorEl}
        open={open}
        disableRestoreFocus
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        PaperProps={{
          style: {
            width: '400px',
            maxHeight: '400px',
            minHeight: '50px'
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2, py: 1 }}>
          <Typography variant="body3" sx={{ opacity: 0.65, color: textColor }}>
            Mục đánh dấu
          </Typography>
          {starredBoards?.map((board, index) => (
            <MenuItem key={index} sx={{ pl: 1 }} onClick={() => handleGoToBoardStarred(board._id)}>
              <Typography variant="body3" sx={{ color: textColor }}>
                {board.title}
              </Typography>
            </MenuItem>
          ))}
          {starredBoards?.length === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1, opacity: 0.6, gap: 1 }}>
              <StarIcon sx={{ color: textColor }} />
              <Typography variant="body2" sx={{ color: textColor }}>
                Không có mục nào đã đánh dấu
              </Typography>
            </Box>
          )}
        </Box>
      </Menu>
    </Box>
  )
}

export default Starred
