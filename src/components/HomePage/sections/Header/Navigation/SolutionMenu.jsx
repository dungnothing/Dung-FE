import { Divider, Box } from '@mui/material'
import BusinessIcon from '@mui/icons-material/Business'
import PersonIcon from '@mui/icons-material/Person'
import { ITIcon, ProductIcon, SaleIcon, MarketingIcon, HRIcon, RetailIcon, MediaIcon } from '~/icon/Icon'
import SettingsIcon from '@mui/icons-material/Settings'
import MenuButton from './MenuButton'

function SolutionMenu() {
  return (
    <div className="min-h-[340px] flex pt-15">
      {/* Bên trái - Quy mô */}
      <Box
        sx={{
          width: '30%',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          pl: 8,
          pr: 8
        }}
      >
        <div className="text-[20px] font-inter font-light text-[#333446]">Quy mô</div>
        <MenuButton title="Doanh nghiệp" icon={<BusinessIcon />} />
        <MenuButton title="Cá nhân" icon={<PersonIcon />} />
      </Box>

      <Divider orientation="vertical" variant="middle" flexItem />

      {/* Giữa - Các tính năng */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', pl: 6, pr: 8, width: '45%' }}>
        <div className="text-[20px] font-inter font-light text-[#333446]">Các tính năng</div>
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <MenuButton title="Marketing" icon={<MarketingIcon />} />
          <MenuButton title="Bán hàng" icon={<SaleIcon />} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <MenuButton title="Sản phẩm" icon={<ProductIcon />} />
          <MenuButton title="Hoạt động" icon={<SettingsIcon />} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <MenuButton title="IT" icon={<ITIcon />} />
          <MenuButton title="Nhân sự" icon={<HRIcon />} />
        </Box>
      </Box>

      <Divider orientation="vertical" variant="middle" flexItem />

      {/* Bên phải - Khác */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', pl: 4, pr: 4, width: '25%' }}>
        <div className="text-[20px] font-inter font-light text-[#333446]">Khác</div>
        <MenuButton title="Buôn bán" icon={<RetailIcon />} />
        <MenuButton title="Đa phương tiện" icon={<MediaIcon />} />
      </Box>
    </div>
  )
}

export default SolutionMenu
