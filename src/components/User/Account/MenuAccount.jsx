import { Box, List, ListItemButton, ListItemIcon, ListItemText, Tooltip, useMediaQuery, useTheme } from '@mui/material'
import { User, Lock, Trash2 } from 'lucide-react'
import { InstagramIcon as Instagram } from '~/icon/Icon'
import { useNavigate, useLocation } from 'react-router-dom'
import { textColor } from '~/utils/constants'

const ACTIVE_COLOR = '#7C3AED'

const tabsData = [
  { label: 'Thông tin cơ bản', icon: <User size={18} />, path: '/user/info' },
  { label: 'Mật khẩu', icon: <Lock size={18} />, path: '/user/password' },
  { label: 'Mạng xã hội (Incoming)', icon: <Instagram size={18} />, path: null },
  { label: 'Xóa tài khoản', icon: <Trash2 size={18} />, path: '/user/delete' }
]

export default function ProfileSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.only('xs'))

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: '1px solid #e0e0e0',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        py: 1,
        width: { xs: 'auto', sm: '100%' },
        maxWidth: { xs: 'none', sm: 300 },
        height: 'fit-content'
      }}
    >
      <List disablePadding>
        {tabsData.map((tab) => {
          const active = location.pathname === tab.path
          const item = (
            <ListItemButton
              key={tab.label}
              selected={active}
              onClick={() => tab.path && navigate(tab.path)}
              sx={{
                py: 1.2,
                px: { xs: 1, sm: 2 },
                gap: 1.5,
                alignItems: 'center',
                justifyContent: { xs: 'center', sm: 'flex-start' },
                minWidth: { xs: 44, sm: 'auto' },
                borderLeft: active ? `3px solid ${ACTIVE_COLOR}` : '3px solid transparent',
                '&.Mui-selected': {
                  bgcolor: 'rgba(124, 58, 237, 0.08)',
                  color: ACTIVE_COLOR,
                  '& .MuiListItemIcon-root': { color: ACTIVE_COLOR }
                },
                '&:hover': { bgcolor: 'rgba(124, 58, 237, 0.04)' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 24, color: active ? ACTIVE_COLOR : '#64748b' }}>
                {tab.icon}
              </ListItemIcon>
              {!isXs && (
                <ListItemText
                  primary={tab.label}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 500, color: active ? ACTIVE_COLOR : textColor }}
                />
              )}
            </ListItemButton>
          )

          return isXs ? (
            <Tooltip key={tab.label} title={tab.label} placement="right" arrow>
              {item}
            </Tooltip>
          ) : (
            <span key={tab.label}>{item}</span>
          )
        })}
      </List>
    </Box>
  )
}
