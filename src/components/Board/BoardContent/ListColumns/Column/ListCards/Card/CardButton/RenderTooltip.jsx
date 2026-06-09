import { IconButton, Tooltip } from '@mui/material'
import { textColor } from '~/utils/constants'

const RenderTooltip = ({ title, icon, handleClick, disabled }) => {
  return (
    <Tooltip title={title} arrow>
      <span>
        <IconButton
          size="small"
          onClick={handleClick}
          disabled={disabled}
          sx={{
            color: textColor,
            border: '1px solid #DCDFE4',
            borderRadius: '8px',
            p: '6px',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.06)', borderColor: '#b0b7c3' },
            '&.Mui-disabled': { opacity: 0.4 }
          }}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  )
}

export default RenderTooltip
