import { TextField, Typography } from '@mui/material'
import { textColor } from '~/utils/constants'

function BoardTitle({ isEditing, setIsEditing, editedTitle, setEditedTitle, boardTitle, handleUpdateTitle }) {
  return isEditing ? (
    <TextField
      value={editedTitle}
      onChange={(e) => setEditedTitle(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleUpdateTitle()
        }
      }}
      onBlur={() => {
        setIsEditing(false)
        setEditedTitle(boardTitle)
      }}
      autoFocus
      variant="outlined"
      sx={{
        fontSize: '1.2rem',
        input: {
          color: textColor,
          padding: '4px 8px',
          height: '32px'
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: textColor
          },
          '&:hover fieldset': {
            borderColor: textColor
          },
          '&.Mui-focused fieldset': {
            borderColor: textColor
          }
        }
      }}
    />
  ) : (
    <Typography
      variant="subtitle2"
      onClick={() => setIsEditing(true)}
      sx={{
        fontSize: '18px',
        fontWeight: 700,
        color: textColor,
        cursor: 'pointer'
      }}
    >
      {boardTitle}
    </Typography>
  )
}

export default BoardTitle
