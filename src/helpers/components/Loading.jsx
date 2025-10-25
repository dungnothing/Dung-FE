import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

function Loading({ className, size = 24 }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        height: '100%',
        width: '100%'
      }}
      className={className}
    >
      <CircularProgress size={size} />
      <Typography>Đang tải đợi xíu :3</Typography>
    </Box>
  )
}

export default Loading
