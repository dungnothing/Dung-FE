import Slider from 'react-slick'
import { Box } from '@mui/material'
import TestimonialSlide from './TestimonialSlide'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const testimonials = [
  {
    quote:
      '[Wednesday] là công cụ lý tưởng để kết nối những tâm hồn đồng điệu trong cuộc đời đầy rẫy những lo toan vất vả. Lựa chọn Wednesday là một quyết định đúng đắn để dẫn đến thành công hôm nay của tôi.',
    author: 'Dũng MC',
    title: 'Giám đốc điều hành tại Mac-UV',
    stat: '95% người dùng nói rằng Wednesday giúp họ tìm được giải pháp tối ưu hơn trong quản lý công việc của họ.',
    source: 'Khảo sát ý kiến người dùng của Wednesday'
  },
  {
    quote:
      'Chúng tôi sử dụng Wednesday để làm rõ các bước, yêu cầu và thủ tục. Đây là điều đặc biệt khi giao tiếp với các nhóm có sự khác biệt sâu sắc về ngôn ngữ và văn hóa',
    author: 'John Wick',
    title: 'Giám đốc phát triển KTA/PLC',
    stat: '77% người cho biết Wednesday giúp họ cải thiện giao tiếp với đồng nghiệp.',
    source: 'Khảo sát ý kiến người dùng của Wednesday'
  },
  {
    quote:
      '[Wednesday] lý tưởng cho việc đơn giản hóa các quy trình. Là người quản lý, tôi có thể chia quy trình thành từng phần nhỏ cho nhóm rồi phân công công việc nhưng vẫn có thể quan sát toàn bộ quy trình.',
    author: 'Jirachino1',
    title: 'Chủ tịch tập đoàn PLMJT',
    stat: '80% người dùng thích sự thân thiện của Wednesday.',
    source: 'Khảo sát ý kiến người dùng của Wednesday'
  }
]

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  arrows: true,
  slidesToShow: 1,
  slidesToScroll: 1
}

function NoiPhet() {
  return (
    <Box sx={{ width: 'full', px: { xs: 4, md: 10, lg: 30 } }}>
      <Slider {...settings} className="custom-slick">
        {testimonials.map((item, index) => (
          <TestimonialSlide key={index} {...item} />
        ))}
      </Slider>
    </Box>
  )
}

export default NoiPhet
