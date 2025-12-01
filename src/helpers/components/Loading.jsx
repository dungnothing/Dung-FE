import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

function Loading({ className, size = 48 }) {
  return (
    <Box
      sx={{
        position: 'fixed', // cố định trên viewport
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // overlay mờ
        zIndex: 9999
      }}
      className={className}
    >
      <CircularProgress size={size} />
      <Typography>Đang tải đợi xíu :3</Typography>
    </Box>
  )
}

export default Loading
