import { Box, Button, Dialog, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined'

function PaymentRequiredDialog({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={null} // Không cho đóng bằng click ra ngoài
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: '24px',
          overflow: 'hidden',
          width: '420px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.18)'
        }
      }}
    >
      {/* Header gradient */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #615FFF 0%, #9B59F5 50%, #C471ED 100%)',
          pt: 5,
          pb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            top: -60,
            right: -60
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 130,
            height: 130,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            bottom: -40,
            left: -30
          }}
        />

        {/* Icon */}
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(255,255,255,0.3)',
            zIndex: 1
          }}
        >
          <LockOutlinedIcon sx={{ color: '#fff', fontSize: 36 }} />
        </Box>

        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, textAlign: 'center', zIndex: 1, px: 2 }}>
          Nâng cấp tài khoản ngay
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.82)',
            textAlign: 'center',
            fontSize: '14px',
            zIndex: 1,
            px: 3,
            lineHeight: 1.6
          }}
        >
          Bạn cần đăng ký gói dịch vụ để tiếp tục sử dụng đầy đủ tính năng của nền tảng.
        </Typography>
      </Box>

      {/* Body */}
      <Box sx={{ px: 4, py: 3.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Features list */}
        {['Không giới hạn số lượng bảng', 'Không giới hạn thành viên trong nhóm', 'Hỗ trợ chăm sóc khách hàng'].map(
          (text, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #615FFF, #C471ED)',
                  flexShrink: 0
                }}
              />
              <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>{text}</Typography>
            </Box>
          )
        )}

        {/* CTA Button */}
        <Button
          fullWidth
          onClick={onClose}
          startIcon={<WorkspacePremiumOutlinedIcon />}
          sx={{
            mt: 1.5,
            py: 1.5,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #615FFF 0%, #C471ED 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '15px',
            textTransform: 'none',
            boxShadow: '0 8px 24px rgba(97,95,255,0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4E4BFF 0%, #B05ED6 100%)',
              boxShadow: '0 10px 28px rgba(97,95,255,0.45)',
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          Xem các gói dịch vụ
        </Button>
      </Box>
    </Dialog>
  )
}

export default PaymentRequiredDialog
