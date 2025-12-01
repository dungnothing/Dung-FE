import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { User, Lock, Trash2 } from 'lucide-react'
import { InstagramIcon as Instagram } from '~/icon/Icon'
import { useNavigate, useLocation } from 'react-router-dom'
import { textColor } from '~/utils/constants'

const tabsData = [
  { label: 'Thông tin cơ bản', icon: <User size={18} />, path: '/user/info' },
  { label: 'Mật khẩu', icon: <Lock size={18} />, path: '/user/password' },
  { label: 'Mạng xã hội (Incoming)', icon: <Instagram size={18} /> },
  { label: 'Xóa tài khoản', icon: <Trash2 size={18} />, path: '/user/delete' }
]

export default function ProfileSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <Box
      sx={{
        borderRadius: 3,
        border: '1px solid #e0e0e0',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        py: 1,
        width: '100%',
        maxWidth: 300,
        height: 'fit-content'
      }}
    >
      <List disablePadding>
        {tabsData.map((tab) => (
          <ListItemButton
            key={tab.label}
            selected={location.pathname === tab.path}
            onClick={() => {
              navigate(tab.path)
            }}
            sx={{
              py: 1.2,
              px: 2,
              gap: 1.5,
              alignItems: 'center',
              borderLeft: location.pathname === tab.path ? '3px solid #7C3AED' : '3px solid transparent',
              '&.Mui-selected': {
                bgcolor: 'rgba(124, 58, 237, 0.08)', // tím nhạt
                color: '#7C3AED',
                '& .MuiListItemIcon-root': { color: '#7C3AED' }
              },
              '&:hover': {
                bgcolor: 'rgba(124, 58, 237, 0.04)'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 24, color: '#64748b' }}>{tab.icon}</ListItemIcon>
            <ListItemText
              primary={tab.label}
              sx={{ fontSize: 14, fontWeight: 500, color: location.pathname === tab.path ? '#7C3AED' : textColor }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
}
