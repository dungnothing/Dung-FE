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
            borderRadius: '8px',
            p: '7px',
            color: 'text.secondary',
            '&:hover': { bgcolor: 'action.hover' },
            '&.Mui-disabled': { opacity: 0.38 }
          }}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  )
}

export default RenderTooltip
