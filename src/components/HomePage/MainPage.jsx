import { Box, Button } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useNavigate } from 'react-router-dom'
import CardArrow from '../../components/HomePage/Body/Main/CardArrow'
import Table from '../../components/HomePage/Body/Main/Table'
import NoiPhet from '../../components/HomePage/Body/Main/NoiPhet'

function MainPage({ isChoice }) {
  const navigate = useNavigate()
  return (
    <Box
      component="main"
      sx={{
        width: '100%',
        maxWidth: '100%',
        zIndex: 0,
        pt: 8,
        '& > *': {
          transition: 'all 0.2s ease',
          filter: isChoice ? 'blur(6px) brightness(0.8)' : 'none',
          opacity: isChoice ? 0.8 : 1,
          pointerEvents: isChoice ? 'none' : 'auto'
        }
      }}
    >
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
        <div className="md:text-[72px] text-[40px] font-extralight min-w-[400px] w-0.6 text-center">
          Gió is like a wind, alway by my side
        </div>

        {/* Text cho màn hình >= md */}
        <div className="hidden md:block text-[20px] font-light min-w-[400px] max-w-[700px] text-center pb-2">
          Hợp lý hóa quy trình làm việc, tạo sự kết nối liền mạch giữa các nhóm và nâng cao hiệu quả vận hành nhờ một hệ
          thống linh hoạt, giúp bạn luôn nắm bắt toàn cảnh để ra quyết định nhanh chóng, chính xác và tự tin hơn mỗi
          ngày.
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

      {/* Bạn có thể thêm các phần tử khác ở đây, chúng cũng sẽ bị làm mờ */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <div className="text-[54px] font-extralight text-center">Nâng cao hiệu suất công việc của bạn</div>
        <div className="text-[20px] font-light m-w-[400px] w-full text-center ">
          Một hệ thống linh hoạt, giúp bạn làm việc nhóm hiệu quả
        </div>
      </Box>

      <CardArrow />

      <Table />

      <div className="w-full justify-center text-[20px] font-light text-center py-10 lg:px-0 px-4">
        Được tin dùng bởi 123,456+ người dùng trên toàn thế giới
      </div>

      <NoiPhet />
    </Box>
  )
}

export default MainPage
