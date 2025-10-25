import { Divider, Box } from '@mui/material'
import { AboutMeIcon, NewIcon, BlogIcon, HelpIcon, Help247Icon } from '~/icon/Icon'
import RenderButton from './RenderButton'

function Resource() {
  return (
    <div className="min-h-[340px] flex pt-15">
      {/* Bên trái */}
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
        <RenderButton title="Wednesday" icon={<AboutMeIcon />} />
        <RenderButton title="Có gì mới" icon={<NewIcon />} />
        <RenderButton title="Blog" icon={<BlogIcon />} />
      </Box>

      <Divider orientation="vertical" variant="middle" flexItem />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pl: 6, pr: 8, width: '50%' }}>
        <div className="text-[20px] font-inter font-light text-[#333446]">Hỗ trợ</div>
        <RenderButton title="Trung tâm trợ giúp" icon={<HelpIcon />} />
        <RenderButton title="Hỗ trợ bằng cơm" icon={<Help247Icon />} />
      </Box>
    </div>
  )
}

export default Resource
