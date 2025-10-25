import { Box, Typography, Divider, useMediaQuery, useTheme } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PaymentIcon from '@mui/icons-material/Payment'
import SettingsIcon from '@mui/icons-material/Settings'
import ViewListIcon from '@mui/icons-material/ViewList'
import TaskIcon from '@mui/icons-material/Task'
import MainBoard from './MainBoard/MainBoard'
import Template from './Template/Template'
import { useState, useEffect } from 'react'
import Task from './Task/Task'
import Setting from './Setting/Setting'
import { useNavigate, useLocation } from 'react-router-dom'
import { textColor } from '~/utils/constants'
import Pay from '../../../pages/User/Payment'

const DashboardContent = ({ searchValue }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.only('xs'))

  const [selectedItem, setSelectedItem] = useState(() => {
    const params = new URLSearchParams(location.search)
    return params.get('tab') || 'MainBoardTop'
  })

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tab = params.get('tab') || 'MainBoardTop'
    setSelectedItem(tab)
  }, [location.search])

  const handleSelect = (item) => {
    setSelectedItem(item)
    navigate(`?tab=${item}`)
  }

  const renderContent = () => {
    if (selectedItem.includes('MainBoard')) {
      return <MainBoard searchValue={searchValue} />
    }
    if (selectedItem.includes('Template')) return <Template />
    if (selectedItem.includes('Tasks')) return <Task />
    if (selectedItem.includes('Settings')) return <Setting />
    if (selectedItem.includes('Payment')) return <Pay />
    return <MainBoard searchValue={searchValue} />
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
            onClick={() => handleSelect('MainBoardTop')}
            sx={{
              bgcolor: selectedItem === 'MainBoardTop' ? bgMenu : 'transparent',
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
            <DashboardIcon sx={{ color: selectedItem === 'MainBoardTop' ? '#578FCA' : 'inherit' }} />
            {!isXs && (
              <Typography sx={{ pl: 1, color: selectedItem === 'MainBoardTop' ? '#578FCA' : 'inherit' }}>
                Bảng
              </Typography>
            )}
          </Box>

          <Box
            onClick={() => handleSelect('TemplateTop')}
            sx={{
              bgcolor: selectedItem === 'TemplateTop' ? bgMenu : 'transparent',
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
            <ViewListIcon sx={{ color: selectedItem === 'TemplateTop' ? '#578FCA' : 'inherit' }} />
            {!isXs && (
              <Typography sx={{ pl: 1, color: selectedItem === 'TemplateTop' ? '#578FCA' : 'inherit' }}>Mẫu</Typography>
            )}
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
            onClick={() => handleSelect('MainBoardBottom')}
            sx={{
              bgcolor: selectedItem === 'MainBoardBottom' ? bgMenu : 'transparent',
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
            <DashboardIcon sx={{ color: selectedItem === 'MainBoardBottom' ? '#578FCA' : 'inherit' }} />
            {!isXs && (
              <Typography sx={{ pl: 1, color: selectedItem === 'MainBoardBottom' ? '#578FCA' : 'inherit' }}>
                Bảng
              </Typography>
            )}
          </Box>

          <Box
            onClick={() => handleSelect('Tasks')}
            sx={{
              bgcolor: selectedItem === 'Tasks' ? bgMenu : 'transparent',
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
            <TaskIcon sx={{ color: selectedItem === 'Tasks' ? '#578FCA' : 'inherit' }} />
            {!isXs && (
              <Typography sx={{ pl: 1, color: selectedItem === 'Tasks' ? '#578FCA' : 'inherit' }}>Nhiệm vụ</Typography>
            )}
          </Box>

          <Box
            onClick={() => handleSelect('Settings')}
            sx={{
              bgcolor: selectedItem === 'Settings' ? bgMenu : 'transparent',
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
            <SettingsIcon sx={{ color: selectedItem === 'Settings' ? '#578FCA' : 'inherit' }} />
            {!isXs && (
              <Typography sx={{ pl: 1, color: selectedItem === 'Settings' ? '#578FCA' : 'inherit' }}>
                Cài đặt
              </Typography>
            )}
          </Box>

          <Box
            onClick={() => handleSelect('Payment')}
            sx={{
              bgcolor: selectedItem === 'Payment' ? bgMenu : 'transparent',
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
            <PaymentIcon sx={{ color: selectedItem === 'Payment' ? '#578FCA' : 'inherit' }} />
            {!isXs && (
              <Typography sx={{ pl: 1, color: selectedItem === 'Payment' ? '#578FCA' : 'inherit' }}>
                Thanh toán
              </Typography>
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
        {renderContent()}
      </Box>
    </Box>
  )
}

export default DashboardContent
