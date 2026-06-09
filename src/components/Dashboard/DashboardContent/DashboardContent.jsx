import { Box, Typography, Divider, Tooltip, useMediaQuery, useTheme } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PaymentIcon from '@mui/icons-material/Payment'
import SettingsIcon from '@mui/icons-material/Settings'
import ViewListIcon from '@mui/icons-material/ViewList'
import TaskIcon from '@mui/icons-material/Task'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { textColor } from '~/utils/constants'

const ACTIVE_COLOR = '#578FCA'

const TOP_ITEMS = [
  { path: 'boards', label: 'Bảng', icon: DashboardIcon },
  { path: 'templates', label: 'Mẫu', icon: ViewListIcon }
]

const WORKSPACE_ITEMS = [
  { path: 'tasks', label: 'Nhiệm vụ', icon: TaskIcon },
  { path: 'settings', label: 'Cài đặt', icon: SettingsIcon },
  { path: 'payment', label: 'Thanh toán', icon: PaymentIcon }
]

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
  const bgHover = (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(87,143,202,0.08)')

  const MenuItem = ({ item }) => {
    const active = isActive(item.path)
    const Icon = item.icon
    const content = (
      <Box
        onClick={() => navigate(item.path)}
        sx={{
          position: 'relative',
          bgcolor: active ? bgMenu : 'transparent',
          color: active ? ACTIVE_COLOR : textColor,
          borderRadius: '10px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', sm: 'flex-start' },
          px: { xs: 0, sm: '12px' },
          width: { xs: '40px', sm: '100%' },
          cursor: 'pointer',
          transition: 'background-color 0.2s ease, color 0.2s ease, transform 0.15s ease',
          // thanh chỉ báo dọc bên trái khi active
          '&::before': {
            content: '""',
            position: 'absolute',
            left: { xs: '50%', sm: 0 },
            top: { xs: 'auto', sm: '50%' },
            bottom: { xs: 4, sm: 'auto' },
            transform: { xs: 'translateX(-50%)', sm: 'translateY(-50%)' },
            width: { xs: active ? '16px' : 0, sm: '3px' },
            height: { xs: '3px', sm: active ? '20px' : 0 },
            borderRadius: '3px',
            bgcolor: ACTIVE_COLOR,
            transition: 'all 0.2s ease'
          },
          '&:hover': {
            bgcolor: active ? bgMenu : bgHover,
            transform: 'translateX(2px)'
          }
        }}
      >
        <Icon sx={{ color: active ? ACTIVE_COLOR : 'inherit', fontSize: '22px' }} />
        {!isXs && <Typography sx={{ pl: 1.5, fontWeight: active ? 600 : 500, fontSize: '0.95rem' }}>{item.label}</Typography>}
      </Box>
    )

    return isXs ? (
      <Tooltip title={item.label} placement="right" arrow>
        {content}
      </Tooltip>
    ) : (
      content
    )
  }

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
            gap: 0.75,
            py: { xs: 0, sm: 6 }
          }}
        >
          {TOP_ITEMS.map((item) => (
            <MenuItem key={item.path} item={item} />
          ))}

          {!isXs ? (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="overline"
                sx={{ px: '12px', py: '4px', color: 'text.secondary', fontWeight: 700, letterSpacing: '0.5px' }}
              >
                Không gian làm việc
              </Typography>
            </>
          ) : (
            <Divider sx={{ my: 0.5 }} />
          )}

          {WORKSPACE_ITEMS.map((item) => (
            <MenuItem key={item.path} item={item} />
          ))}
        </Box>
      </Box>
      {/* Main content */}
      <Box
        sx={{
          borderLeft: '1px solid #ccc',
          pl: 1,
          width: { xs: '100%', sm: '70%' },
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
