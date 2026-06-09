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
            borderRadius: '8px',
            p: '6px',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' },
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
