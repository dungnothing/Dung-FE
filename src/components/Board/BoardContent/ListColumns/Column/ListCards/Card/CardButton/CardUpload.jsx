import { IconButton, Tooltip, CircularProgress } from '@mui/material'
import { textColor } from '~/utils/constants'

function CardUpload({ title, icon, loading = false, disabled = false, accept, inputRef, onChange }) {
  return (
    <div>
      <Tooltip title={title} arrow>
        <span>
          <IconButton
            size="small"
            onClick={() => inputRef.current.click()}
            disabled={loading || disabled}
            sx={{
              color: textColor,
              borderRadius: '8px',
              p: '6px',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' },
              '&.Mui-disabled': { opacity: 0.4 }
            }}
          >
            {loading ? <CircularProgress size={18} sx={{ color: textColor }} /> : icon}
          </IconButton>
        </span>
      </Tooltip>
      <input type="file" ref={inputRef} style={{ display: 'none' }} onChange={onChange} accept={accept} />
    </div>
  )
}

export default CardUpload
