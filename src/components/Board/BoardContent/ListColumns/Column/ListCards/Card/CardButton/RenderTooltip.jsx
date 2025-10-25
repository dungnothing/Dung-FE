import { Button, Tooltip } from '@mui/material'
import { textColor } from '~/utils/constants'

const RenderTooltip = ({ title, icon, handleClick, disabled }) => {
  return (
    <Tooltip title={title}>
      <Button
        startIcon={icon}
        sx={{
          color: textColor,
          border: '1px solid #DCDFE4'
        }}
        onClick={handleClick}
        variant="outlined"
        disabled={disabled}
      ></Button>
    </Tooltip>
  )
}

export default RenderTooltip
