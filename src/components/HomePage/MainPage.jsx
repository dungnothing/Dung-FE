import { Box } from '@mui/material'
import { useOutletContext } from 'react-router-dom'
import HeroSection from './sections/Hero/HeroSection'
import FeatureCards from './sections/Features/FeatureCards'
import ProductivitySection from './sections/Features/ProductivitySection'
import Testimonials from './sections/Features/Testimonials'

function MainPage() {
  const isChoice = useOutletContext()

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
      {/* Hero Section */}
      <HeroSection />

      {/* Value Proposition */}
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

      {/* Feature Cards Carousel */}
      <FeatureCards />

      {/* Productivity Features */}
      <ProductivitySection />

      {/* Social Proof */}
      <div className="w-full justify-center text-[20px] font-light text-center py-10 lg:px-0 px-4">
        Được tin dùng bởi 123,456+ người dùng trên toàn thế giới
      </div>

      {/* Testimonials */}
      <Testimonials />
    </Box>
  )
}

export default MainPage
