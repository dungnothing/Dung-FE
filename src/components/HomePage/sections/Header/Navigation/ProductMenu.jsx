import { Divider, Box, Button } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import MenuButton from './MenuButton'

const leftPanelItems = [
  { icon: <DashboardIcon sx={{ width: '16px', height: '16px' }} />, label: 'Bảng điều khiển', path: '/control' },
  { icon: <ElectricBoltIcon sx={{ width: '16px', height: '16px' }} />, label: 'Tích hợp' },
  { icon: <AutoAwesomeIcon sx={{ width: '16px', height: '16px' }} />, label: 'Tự động hóa' }
]

const rightPanelItems = [
  { image: 'https://i.pinimg.com/474x/b5/6a/22/b56a229148586984a9333522caa533b9.jpg', label: 'Dự án, công việc' },
  { image: 'https://i.pinimg.com/474x/13/61/d0/1361d070f33f7f319d93e99084620485.jpg', label: 'Công việc hàng ngày' },
  { image: 'https://i.pinimg.com/474x/da/c9/b8/dac9b8c6472c1cdad6c265f61a9b9524.jpg', label: 'Nhóm khách hàng' },
  { image: 'https://i.pinimg.com/474x/69/6e/bb/696ebb7a89d2d5a0f354d4d5ac1f1b72.jpg', label: 'Dịch vụ và hỗ trợ' }
]

const productButtonStyle = {
  width: '50%',
  color: '#333446',
  opacity: 0.8,
  '&:hover': {
    backgroundColor: '#F0F3FF'
  },
  justifyContent: 'flex-start',
  gap: '8px'
}

function ProductMenu({ onClose }) {
  return (
    <Box sx={{ minHeight: '340px', display: 'flex', pt: '60px' }}>
      {/* Bên trái - Platforms */}
      <Box
        sx={{
          width: '35%',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          pl: 8,
          pr: 8
        }}
      >
        <div className="text-[20px] font-light text-[#333446]">Các nền tảng</div>
        {leftPanelItems.map((item, index) => (
          <MenuButton key={index} title={item.label} icon={item.icon} path={item.path} onClose={onClose} />
        ))}
      </Box>

      <Divider orientation="vertical" variant="middle" flexItem />

      {/* Bên phải - Products */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', pl: 6, pr: 8, width: '65%' }}>
        <div className="text-[20px] font-light text-[#333446]">Sản phẩm</div>
        {[...Array(Math.ceil(rightPanelItems.length / 2))].map((_, rowIndex) => (
          <Box key={rowIndex} sx={{ display: 'flex', gap: 2 }}>
            {rightPanelItems.slice(rowIndex * 2, rowIndex * 2 + 2).map((item, index) => (
              <Button key={index} disableRipple sx={productButtonStyle} onClick={onClose}>
                <img src={item.image} alt={item.label} className="w-[30px] h-[30px]" />
                <span className="font-normal">{item.label}</span>
              </Button>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default ProductMenu
