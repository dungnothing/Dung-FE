import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

function BasicLoading({ className, size = 48 }) {
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
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'), // overlay mờ
        zIndex: 9999
      }}
      className={className}
    >
      <CircularProgress size={size} />
      <Typography>Đang tải đợi xíu :3</Typography>
    </Box>
  )
}

export default BasicLoading
