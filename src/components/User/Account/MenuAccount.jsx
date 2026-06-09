import { Box, Typography } from '@mui/material'
import { User, Lock, Trash2 } from 'lucide-react'
import { InstagramIcon as Instagram } from '~/icon/Icon'
import { useNavigate, useLocation } from 'react-router-dom'

const ACTIVE_COLOR = '#7C3AED'

const tabsData = [
  { label: 'Thông tin cơ bản', icon: <User size={16} />, path: '/user/info' },
  { label: 'Mật khẩu', icon: <Lock size={16} />, path: '/user/password' },
  { label: 'Mạng xã hội', icon: <Instagram size={16} />, path: null },
  { label: 'Xóa tài khoản', icon: <Trash2 size={16} />, path: '/user/delete' }
]

export default function MenuAccount() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'row',
        overflowX: 'auto',
        '&::-webkit-scrollbar': { display: 'none' }
      }}
    >
      {tabsData.map((tab) => {
        const active = location.pathname === tab.path
        return (
          <Box
            key={tab.label}
            onClick={() => tab.path && navigate(tab.path)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: { xs: 1.5, sm: 2.5 },
              py: 1.5,
              cursor: tab.path ? 'pointer' : 'default',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              color: active ? ACTIVE_COLOR : '#64748b',
              borderBottom: active ? `2px solid ${ACTIVE_COLOR}` : '2px solid transparent',
              bgcolor: active ? 'rgba(124,58,237,0.06)' : 'transparent',
              transition: 'all 0.2s',
              '&:hover': tab.path ? { bgcolor: 'rgba(124,58,237,0.04)', color: ACTIVE_COLOR } : {}
            }}
          >
            {tab.icon}
            <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, fontWeight: active ? 600 : 500 }}>
              {tab.label}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}
