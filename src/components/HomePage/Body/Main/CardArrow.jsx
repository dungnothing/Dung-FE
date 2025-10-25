import { Box, Card, IconButton, Button } from '@mui/material'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useRef } from 'react'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const cardData = [
  {
    title: 'Sáng tạo',
    title1: '& Thiết kế',
    description: 'Sự kết hợp hoàn hảo',
    gradientColors: '#24C4E6',
    iconText: 'Wednesday work',
    iconText1: 'management',
    icon: <BusinessCenterIcon sx={{ color: '#FFFDF6' }} />
  },
  {
    title: 'Sản phẩm',
    title1: '& Phần mềm',
    description: 'Quá nhanh quá nguy hiểm',
    gradientColors: '#FF596D',
    iconText: 'Wednesday work',
    iconText1: 'management',
    icon: <BusinessCenterIcon sx={{ color: '#FFFDF6' }} />
  },
  {
    title: 'Nhân sự',
    title1: '& Tuyển dụng',
    description: 'Chiêu mộ nhân tài',
    gradientColors: '#1F0F83',
    iconText: 'Wednesday work',
    iconText1: 'management',
    icon: <BusinessCenterIcon sx={{ color: '#FFFDF6' }} />
  },
  {
    title: 'Marketing',
    title1: '& Thương hiệu',
    description: 'Tạo ra sự khác biệt',
    gradientColors: '#879AFF',
    iconText: 'Wednesday work',
    iconText1: 'management',
    icon: <BusinessCenterIcon sx={{ color: '#FFFDF6' }} />
  },
  {
    title: 'Dự án',
    title1: '& Công việc',
    description: 'Hoàn thành đúng hạn mọi dự án',
    gradientColors: '#00CA72',
    iconText: 'Wednesday work',
    iconText1: 'management',
    icon: <BusinessCenterIcon sx={{ color: '#FFFDF6' }} />
  },
  {
    title: 'CRM',
    title1: '& Bán Hàng',
    description: 'Tập trung vào những giao dịch hiệu quả',
    gradientColors: '#673971',
    iconText: 'Wednesday',
    iconText1: 'CRM',
    icon: <SupportAgentIcon sx={{ color: '#FFFDF6' }} />
  },
  {
    title: 'IT',
    title1: '& Hỗ Trợ',
    description: 'Giải quyết vấn đề nhanh chóng',
    gradientColors: '#879AFF',
    iconText: 'Wednesday',
    iconText1: 'support',
    icon: <SupportAgentIcon sx={{ color: '#FFFDF6' }} />
  }
]

const settings = {
  dots: false,
  infinite: true,
  speed: 400,
  slidesToShow: 5,
  slidesToScroll: 1,
  arrows: false,
  centerMode: true,
  centerPadding: '0',
  responsive: [
    {
      breakpoint: 1500,
      settings: {
        slidesToShow: 4
      }
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3
      }
    },
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 2
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        centerMode: false,
        centerPadding: '0px'
      }
    }
  ]
}

function CardArrow() {
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState(null)
  const sliderRef = useRef(null)

  return (
    <Box
      sx={{
        width: '100%',
        p: 4,
        position: 'relative',
        '& .slick-slide': {
          padding: '0 10px',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'center'
        },
        '& .slick-list': {
          margin: '0 -10px'
        },
        '& .slick-slide > div': {
          display: 'flex',
          justifyContent: 'center'
        }
      }}
    >
      <Slider ref={sliderRef} {...settings}>
        {cardData.map((card, index) => (
          <div key={index}>
            <Card
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              sx={{
                width: '314px',
                height: '350px',
                bgcolor: card.gradientColors,
                borderRadius: '8px',
                p: 4,
                minWidth: '250px',
                gap: 2,
                position: 'relative'
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease',
                  opacity: hoveredCard === index ? 0.2 : 1,
                  transform: hoveredCard === index ? 'scale(0.95)' : 'scale(1)'
                }}
              >
                <div>
                  <div className="text-[35px] font-light text-[#FFFDF6]">{card.title}</div>
                  <div className="text-[35px] font-light text-[#FFFDF6]">{card.title1}</div>
                  <div className="text-[20px] font-extralight text-[#FFFDF6] pt-4">{card.description}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div>{card.icon}</div>
                  <div className="flex flex-col">
                    <div className="text-[16px] font-extralight text-[#FFFDF6]">{card.iconText}</div>
                    <div className="text-[16px] font-extralight text-[#FFFDF6]">{card.iconText1}</div>
                  </div>
                </div>
              </Box>

              {hoveredCard === index && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      width: '175px',
                      height: '50px',
                      fontSize: '20px',
                      borderRadius: '99px',
                      color: '#333',
                      opacity: 0.8,
                      backgroundColor: '#FFFFFF',
                      '&:hover': {
                        backgroundColor: '#FFFFFF'
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate('/sign-up')
                    }}
                  >
                    Bắt đầu
                  </Button>
                </Box>
              )}
            </Card>
          </div>
        ))}
      </Slider>
      <Box
        sx={{
          width: { xs: '100px', lg: '200px' },
          height: '360px',
          position: 'absolute',
          top: '6%',
          left: '0',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          background: 'linear-gradient(270deg, rgba(255, 255, 255, 0.00) 0%, #FFF 100%)',
          zIndex: 2
        }}
      >
        <IconButton
          sx={{
            bgcolor: '#0E2148',
            '&:hover': {
              transform: 'translateX(-2px) scale(1.1)',
              bgcolor: '#0E2148'
            }
          }}
          onClick={() => sliderRef.current?.slickPrev()}
        >
          <ArrowBackIcon sx={{ fontSize: '30px', color: '#FFFFFF' }} />
        </IconButton>
      </Box>
      <Box
        sx={{
          width: { xs: '100px', lg: '200px' },
          height: '360px',
          position: 'absolute',
          top: '6%',
          right: '0',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          background: 'linear-gradient(270deg, #FFF 0%, rgba(255, 255, 255, 0.00) 90.42%)',
          zIndex: 2
        }}
      >
        <IconButton
          sx={{
            bgcolor: '#0E2148',
            '&:hover': {
              transform: 'translateX(2px) scale(1.1)',
              bgcolor: '#0E2148'
            }
          }}
          onClick={() => sliderRef.current?.slickNext()}
        >
          <ArrowForwardIcon sx={{ fontSize: '30px', color: '#FFFFFF' }} />
        </IconButton>
      </Box>
    </Box>
  )
}

export default CardArrow
