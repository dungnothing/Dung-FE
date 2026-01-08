import { Box, Typography, Divider, useMediaQuery, useTheme } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PaymentIcon from '@mui/icons-material/Payment'
import SettingsIcon from '@mui/icons-material/Settings'
import ViewListIcon from '@mui/icons-material/ViewList'
import TaskIcon from '@mui/icons-material/Task'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { textColor } from '~/utils/constants'

const DashboardContent = ({ searchValue }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.only('xs'))

  const isActive = (path) => {
    if (path === 'boards' && (location.pathname === '/dashboard' || location.pathname === '/dashboard/boards')) {
      return true
    }
    return location.pathname.includes(`/dashboard/${path}`)
  }

  const bgMenu = (theme) => (theme.palette.mode === 'dark' ? '#1C2B41' : '#e9f2ff')

  return (
    <Box
      sx={{
        minHeight: '100%',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#FFFFF'),
        display: 'flex',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: '40px', sm: '30%' },
          height: '100%',
          display: { xs: 'flex', sm: 'flex' },
          gap: 1,
          justifyContent: { xs: 'flex-start', sm: 'flex-end' },
          pr: 1
        }}
      >
        <Box
          sx={{
            width: isXs ? '72px' : '256px',
            minWidth: '72px',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            py: { xs: 0, sm: 6 }
          }}
        >
          <Box
            onClick={() => navigate('boards')}
            sx={{
              bgcolor: isActive('boards') ? bgMenu : 'transparent',
              color: textColor,
              borderRadius: '8px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              px: '8px',
              py: '6px',
              width: { xs: '40px', sm: '100%' },
              cursor: 'pointer'
            }}
          >
            <DashboardIcon sx={{ color: isActive('boards') ? '#578FCA' : 'inherit' }} />
            {!isXs && <Typography sx={{ pl: 1, color: isActive('boards') ? '#578FCA' : 'inherit' }}>Bảng</Typography>}
          </Box>

          <Box
            onClick={() => navigate('templates')}
            sx={{
              bgcolor: isActive('templates') ? bgMenu : 'transparent',
              color: textColor,
              borderRadius: '8px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              px: '8px',
              py: '6px',
              width: { xs: '40px', sm: '100%' },
              cursor: 'pointer'
            }}
          >
            <ViewListIcon sx={{ color: isActive('templates') ? '#578FCA' : 'inherit' }} />
            {!isXs && <Typography sx={{ pl: 1, color: isActive('templates') ? '#578FCA' : 'inherit' }}>Mẫu</Typography>}
          </Box>

          {!isXs && (
            <>
              <Divider />
              <Typography variant="subtitle1" fontWeight="bold" sx={{ px: '8px', py: '6px', color: textColor }}>
                Không gian làm việc
              </Typography>
            </>
          )}

          <Box
            onClick={() => navigate('tasks')}
            sx={{
              bgcolor: isActive('tasks') ? bgMenu : 'transparent',
              color: textColor,
              borderRadius: '8px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              px: '8px',
              py: '6px',
              width: { xs: '40px', sm: '100%' },
              cursor: 'pointer'
            }}
          >
            <TaskIcon sx={{ color: isActive('tasks') ? '#578FCA' : 'inherit' }} />
            {!isXs && (
              <Typography sx={{ pl: 1, color: isActive('tasks') ? '#578FCA' : 'inherit' }}>Nhiệm vụ</Typography>
            )}
          </Box>

          <Box
            onClick={() => navigate('settings')}
            sx={{
              bgcolor: isActive('settings') ? bgMenu : 'transparent',
              color: textColor,
              borderRadius: '8px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              px: '8px',
              py: '6px',
              width: { xs: '40px', sm: '100%' },
              cursor: 'pointer'
            }}
          >
            <SettingsIcon sx={{ color: isActive('settings') ? '#578FCA' : 'inherit' }} />
            {!isXs && (
              <Typography sx={{ pl: 1, color: isActive('settings') ? '#578FCA' : 'inherit' }}>Cài đặt</Typography>
            )}
          </Box>

          <Box
            onClick={() => navigate('payment')}
            sx={{
              bgcolor: isActive('payment') ? bgMenu : 'transparent',
              color: textColor,
              borderRadius: '8px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              px: '8px',
              py: '6px',
              width: { xs: '40px', sm: '100%' },
              cursor: 'pointer'
            }}
          >
            <PaymentIcon sx={{ color: isActive('payment') ? '#578FCA' : 'inherit' }} />
            {!isXs && (
              <Typography sx={{ pl: 1, color: isActive('payment') ? '#578FCA' : 'inherit' }}>Thanh toán</Typography>
            )}
          </Box>
        </Box>
      </Box>
      {/* Main content */}
      <Box
        sx={{
          borderLeft: '1px solid #ccc',
          pl: 1,
          width: '70%',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ccc',
            borderRadius: '4px'
          },
          '&:hover::-webkit-scrollbar-thumb': {
            backgroundColor: '#999'
          }
        }}
      >
        <Outlet context={{ searchValue }} />
      </Box>
    </Box>
  )
}

export default DashboardContent
