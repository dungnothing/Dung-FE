import { Box, Divider } from '@mui/material'
import { AboutMeIcon, BlogIcon, HelpIcon, NewIcon } from '~/icon/Icon'
import MenuButton from './MenuButton'

function ResourceMenu() {
  return (
    <div className="min-h-[340px] flex pt-15">
      {/* Bên trái - Khám phá */}
      <Box
        sx={{
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          pl: 8,
          pr: 8
        }}
      >
        <div className="text-[20px] font-inter font-light text-[#333446]">Khám phá</div>
        <MenuButton title="Wednesday" icon={<AboutMeIcon />} />
        <MenuButton title="Có gì mới" icon={<NewIcon />} />
        <MenuButton title="Blog" icon={<BlogIcon />} />
      </Box>

      <Divider orientation="vertical" variant="middle" flexItem />

      {/* Bên phải - Hỗ trợ */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pl: 6, pr: 8, width: '50%' }}>
        <div className="text-[20px] font-inter font-light text-[#333446]">Hỗ trợ</div>
        <MenuButton title="Trung tâm trợ giúp" icon={<HelpIcon />} path="/help-center" />
      </Box>
    </div>
  )
}

export default ResourceMenu
