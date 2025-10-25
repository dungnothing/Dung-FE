import { Box, Paper } from '@mui/material'
import { useRef, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import box from '~/assets/image-main/box.png'
import table from '~/assets/image-main/table.png'
import planner from '~/assets/image-main/planner.png'

const tabContent = [
  {
    label: 'Hộp thư đến',
    description:
      'Khi bạn nghĩ đến điều gì đó, nó sẽ nằm trong Hộp thư đến của bạn. Ghi lại những việc cần làm của bạn mọi lúc, mọi nơi.',
    desMobile: 'Ghi chú mọi ý tưởng tiện dụng',
    image: box
  },
  {
    label: 'Bảng',
    description:
      'Danh sách việc cần làm của bạn có thể dài, nhưng có thể quản lý được! Theo dõi mọi thứ từ "việc cần làm để giải quyết" đến "nhiệm vụ đã hoàn thành!"',
    desMobile: 'Quản lý danh sách hiệu quả',
    image: table
  },
  {
    label: 'Người lập kế hoạch',
    description:
      'Kéo, thả, hoàn thành. Ghi các nhiệm vụ quan trọng nhất vào lịch và dành thời gian cho những việc thực sự quan trọng.',
    desMobile: 'Dành thời gian cho những việc quan trọng',
    image: planner
  }
]

function Table() {
  const sliderRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => setActiveIndex(next),
    ref: sliderRef
  }

  const handleTabClick = (index) => {
    setActiveIndex(index)
    sliderRef.current.slickGoTo(index)
  }

  return (
    <Box
      sx={{
        width: 'full',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        px: { xs: 4, md: 10, lg: 25 },
        py: { xs: 3, md: 6, lg: 10 },
        gap: 4,
        bgcolor: 'white',
        color: 'black',
        backgroundColor: 'white',
        overflow: 'hidden'
      }}
    >
      <div className="text-[36px] font-medium">Năng suất làm việc mạnh mẽ</div>
      <p className="text-[20px] font-normal max-w-[540px]">
        Luôn ngăn nắp và hiệu quả với hệ thống bảng và cột. Mọi ý tưởng hoặc trách nhiệm dù nhỏ đến đâu đều có vị trí
        của nó. Trăm hạt mưa không hạt nào rơi sai chỗ.
      </p>
      <div className="text-[24px] flex justify-end" style={{ fontFamily: 'Dancing Script', fontWeight: 'medium' }}>
        -- Bùi Dũng --
      </div>

      <Box className="flex gap-8 flex-col lg:flex-row lg:items-center">
        {/* Left Menu */}
        <Box className="w-full lg:w-1/3 flex flex-col lg:flex-col gap-4 justify-center">
          {tabContent.map((tab, index) => (
            <Paper
              key={index}
              onClick={() => handleTabClick(index)}
              className={`cursor-pointer p-4 rounded-xl shadow transition-all border-l-4 h-fit ${
                index === activeIndex ? 'border-cyan-500 bg-white' : 'border-transparent bg-gray-100'
              }`}
              sx={{
                boxShadow: 'rgba(9, 30, 66, 0.15) 0px 0.5rem 1rem 0px',
                maxHeight: '200px',
                overflow: 'hidden',
                minWidth: '200px',
                bgcolor: 'white',
                color: 'black'
              }}
            >
              <div className="font-bold text-gray-800 ">{tab.label}</div>
              <div className="text-gray-600 lg:block hidden">{tab.description}</div>
              <div className="text-gray-600 lg:hidden">{tab.desMobile}</div>
            </Paper>
          ))}
        </Box>

        {/* Right Slider */}
        <Box className="flex-1 lg:w-2/3 w-full">
          <Slider ref={sliderRef} {...settings}>
            {tabContent.map((tab, index) => (
              <img key={index} src={tab.image} alt="" className="w-full h-full rounded-xl " />
            ))}
          </Slider>
        </Box>
      </Box>
    </Box>
  )
}

export default Table
