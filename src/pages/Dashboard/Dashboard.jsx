import AppBar from '~/components/AppBar/AppBar'
import DashboardContent from '../../components/Dashboard/DashboardContent/DashboardContent'
import Container from '@mui/material/Container'
import { useState } from 'react'
import Box from '@mui/material/Box'
import theme from '~/theme'

function Dashboard() {
  const [searchValue, setSearchValue] = useState('')
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh', overflow: 'hidden' }}>
      <AppBar
        sx={{ position: 'fixed', top: 0, zIndex: 1 }}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        showSearch={true}
      />
      <Box
        sx={{
          display: 'flex',
          height: theme.trello.dashboardContentHeight,
          overflow: 'hidden'
        }}
      >
        <DashboardContent searchValue={searchValue} />
      </Box>
    </Container>
  )
}

export default Dashboard
