import { Box, CircularProgress, Typography } from '@mui/material'

/**
 * Component loading cho content area (không full screen)
 * @param {string} message - Thông điệp hiển thị khi loading
 * @param {string} minHeight - Chiều cao tối thiểu của container loading
 */
function ContentLoading({ message = 'Đang tải đợi xíu :3', minHeight = '300px' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        minHeight: minHeight,
        width: '100%'
      }}
    >
      <CircularProgress />
      <Typography>{message}</Typography>
    </Box>
  )
}

export default ContentLoading
