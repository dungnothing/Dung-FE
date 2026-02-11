import { Box, Button } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useNavigate } from 'react-router-dom'

function HeroSection() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        backgroundColor: '#F0F3FF',
        borderRadius: '16px',
        height: 'fit-content',
        minHeight: '400px',
        m: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
        p: 2
      }}
    >
      <div className="md:text-[72px] text-[40px] font-light min-w-[400px] w-0.6 text-center">Mạnh mẽ và linh hoạt</div>

      {/* Text cho màn hình >= md */}
      <div className="hidden md:block text-[20px] font-light min-w-[400px] max-w-[700px] text-center pb-2">
        Hợp lý hóa quy trình làm việc, tạo sự kết nối liền mạch giữa các nhóm và nâng cao hiệu quả vận hành nhờ một hệ
        thống linh hoạt, giúp bạn luôn nắm bắt toàn cảnh để ra quyết định nhanh chóng, chính xác và tự tin hơn mỗi ngày.
      </div>

      {/* Text cho màn hình < md */}
      <div className="block md:hidden text-[16px] font-light text-center pb-2">
        Quản lý dễ dàng, kết nối nhóm hiệu quả và vận hành nhanh hơn.
      </div>

      <Button
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        sx={{
          width: '175px',
          height: '50px',
          fontSize: '20px',
          borderRadius: '99px',
          backgroundColor: '#6161FF',
          color: 'white'
        }}
        onClick={() => navigate('/sign-up')}
      >
        Bắt đầu
      </Button>
    </Box>
  )
}

export default HeroSection
