// TestimonialSlide.jsx
import { Box, Typography, Divider } from '@mui/material'

function TestimonialSlide({ quote, author, title, stat, source }) {
  return (
    <Box
      className="slide-item"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        width: '100%',
        border: '1px solid #E5E7EB'
      }}
    >
      {/* Trích dẫn */}
      <Box sx={{ width: { xs: '100%', lg: '66%' }, p: 4, bgcolor: '#fff', gap: 2 }}>
        <div className="text-sm lg:text-xl font-light text-[#333446]">{quote}</div>

        <Divider sx={{ my: 3, width: '33%', bgcolor: '#333446' }} />

        <Typography sx={{ fontWeight: 500, color: '#333446' }}>{author}</Typography>
        <Typography sx={{ fontWeight: 300, color: '#333446' }}>{title}</Typography>

        <div className="text-[14px] font-light text-[#4300FF] cursor-pointer flex justify-end underline">
          Đọc câu chuyện
        </div>
      </Box>

      {/* Thống kê */}
      <Box
        sx={{
          width: { xs: '100%', lg: '34%' },
          p: 4,
          bgcolor: '#91BAFE',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          justifyContent: 'space-between'
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            lineHeight: 1.5,
            fontSize: { xs: '0.875rem', lg: '1rem' }
          }}
        >
          {stat}
        </Typography>
        <Typography sx={{ textDecoration: 'underline' }}>{source}</Typography>
      </Box>
    </Box>
  )
}

export default TestimonialSlide
