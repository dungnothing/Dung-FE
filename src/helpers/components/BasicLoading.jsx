import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

/**
 * Component loading linh hoạt
 * @param {boolean} fullScreen - Nếu true: full viewport, nếu false: full container
 * @param {number} size - Kích thước của CircularProgress
 * @param {string} message - Thông điệp hiển thị
 */
function BasicLoading({ fullScreen = true, size = 48, message = 'Đang tải đợi xíu :3' }) {
  return (
    <Box
      sx={{
        position: fullScreen ? 'fixed' : 'absolute',
        top: 0,
        left: 0,
        width: fullScreen ? '100vw' : '100%',
        height: fullScreen ? '100vh' : '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'),
        zIndex: fullScreen ? 9999 : 1
      }}
    >
      <CircularProgress size={size} />
      <Typography>{message}</Typography>
    </Box>
  )
}

export default BasicLoading
