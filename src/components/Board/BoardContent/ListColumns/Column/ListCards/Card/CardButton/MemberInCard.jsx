import { Box, Typography, IconButton, Popover } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Avatar from '@mui/material/Avatar'

function MemberInCard({ open, onClose, memberInCard, anchorEl }) {
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            minWidth: '320px',
            height: '200px'
          }
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ p: 1, pl: 2 }} variant="subtitle1">
          Thành viên
        </Typography>
        <IconButton sx={{ p: 0, mr: 1 }} onClick={onClose} disableRipple>
          <CloseIcon />
        </IconButton>
      </Box>
      {memberInCard?.map((member, index) => (
        <Box
          key={index}
          sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 1, minWidth: '200px', maxHeight: '400px' }}
        >
          <Avatar alt={member.memberName} src={member.memberAvatar || ''} sx={{ width: 28, height: 28 }} />
          <Typography variant="body2">{member.memberName}</Typography>
        </Box>
      ))}
      {memberInCard?.length === 0 && (
        <Typography sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 7 }} variant="body2">
          Không có thành viên
        </Typography>
      )}
    </Popover>
  )
}

export default MemberInCard
