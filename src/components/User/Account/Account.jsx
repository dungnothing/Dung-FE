import { Box } from '@mui/material'
import theme from '~/theme'
import MenuAccount from './MenuAccount'
import ContentAccount from './ContentAccount'

function Account() {
  return (
    <Box
      sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#f4f4f4'),
        width: '100%',
        minHeight: theme.trello.dashboardContentHeight,
        pt: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 4, md: 8, lg: 12, xl: 20 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflow: 'hidden'
      }}
    >
      <MenuAccount />
      <Box sx={{ flex: 1, minWidth: 0, pb: 6, overflow: 'hidden' }}>
        <ContentAccount />
      </Box>
    </Box>
  )
}

export default Account
