import { Box } from '@mui/material'
import theme from '~/theme'
import MenuAccount from './MenuAccount'
import ContentAccount from './ContentAccount'

function Account() {
  return (
    <Box
      sx={{
        // backgroundColor: '#f4f4f4',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#f4f4f4'),
        width: '100%',
        minHeight: theme.trello.dashboardContentHeight,
        pt: 6,
        px: { xs: 4, sm: 8, md: 10, lg: 12, xl: 20 },
        display: 'flex',
        gap: { xs: 2, md: 6, xl: 8 },
        overflow: 'hidden'
      }}
    >
      <Box sx={{ flexShrink: 0, width: 260 }}>
        <MenuAccount />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, pb: 6 }}>
        <ContentAccount />
      </Box>
    </Box>
  )
}

export default Account
