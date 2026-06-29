import { Tooltip, IconButton, CircularProgress } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import { textColor } from '~/utils/constants'

function StarButton({ isStarred, handleStarBoard, boardId, loading }) {
  return (
    <Tooltip title="Đánh dấu" placement="bottom">
      <IconButton onClick={() => handleStarBoard(boardId)} disabled={loading} sx={{ p: 0.5 }}>
        {loading ? (
          <CircularProgress size={24} sx={{ color: textColor }} />
        ) : isStarred ? (
          <StarIcon sx={{ color: 'gold' }} />
        ) : (
          <StarOutlineIcon sx={{ color: textColor }} />
        )}
      </IconButton>
    </Tooltip>
  )
}

export default StarButton
