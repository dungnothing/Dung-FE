import { Menu as MuiMenu } from '@mui/material'

function Menu({
  children,
  anchorEl,
  open,
  onClose,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'left' },
  sx = {}
}) {
  return (
    <MuiMenu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      disableRestoreFocus
      disableAutoFocus
      disableAutoFocusItem
      sx={{
        '& .MuiPaper-root': {
          minWidth: 180,
          boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
          borderRadius: 1,
          mt: 0.5,
          ...sx['& .MuiPaper-root']
        },
        ...sx
      }}
    >
      {children}
    </MuiMenu>
  )
}

export default Menu
