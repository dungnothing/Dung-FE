import { Tooltip } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import { textColor } from '~/utils/constants'

function StarButton({ isStarred, handleStarBoard, boardId }) {
  return (
    <Tooltip title="Đánh dấu" placement="bottom">
      {isStarred ? (
        <StarIcon onClick={() => handleStarBoard(boardId)} sx={{ color: 'gold', cursor: 'pointer' }} />
      ) : (
        <StarOutlineIcon onClick={() => handleStarBoard(boardId)} sx={{ cursor: 'pointer', color: textColor }} />
      )}
    </Tooltip>
  )
}

export default StarButton
