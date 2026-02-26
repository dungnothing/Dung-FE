import { useState } from 'react'
import { Box, Typography, Collapse } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'

const faqs = [
  {
    question: 'Wednesday là gì?',
    answer: 'Wednesday là nền tảng dùng để quản lý công việc, xây dựng một quy trình làm việc hiệu quả.'
  },
  {
    question: 'Tại sao nên chọn Wednesday?',
    answer: 'Wednesday cung cấp bộ công cụ mạnh mẽ giúp bạn quản lý công việc, xây dựng quy trình làm việc hiệu quả.'
  },
  {
    question: 'Làm sao để đăng ký và bắt đầu sử dụng Wednesday?',
    answer: 'Bạn chỉ cần tạo một tài khoản miễn phí trên hệ thống, sau đó đăng nhập, mua gói và bắt đầu sử dụng.'
  },
  {
    question: 'Wednesday cung cấp những tính năng nào?',
    answer:
      'Chúng tôi cung cấp đa dạng các tính năng từ quản lý công việc, xây dựng quy trình làm việc, cẩm nang cho mọi người.'
  },
  {
    question: 'Làm sao để mua gói Wednesday?',
    answer:
      'Bạn có thể vào mục thanh toán trên hệ thống, chọn gói phù hợp, sau đó bấm vào và chọn đăng ký tham gia. Hiện tại nền tảng của chúng tôi đang cung cấp tính năng miễn phí. Chỉ cần thêm thông tin thẻ là có thể thanh toán gói trả phí.'
  },
  {
    question: 'Khi gặp sự cố hoặc cần hỗ trợ, tôi phải làm gì?',
    answer:
      'Bạn có thể vào mục hỗ trợ trên hệ thống, chọn liên hệ với chúng tôi. Chúng tôi sẽ hỗ trợ bạn trong thời gian sớm nhất. \nVui lòng gửi email tới dungvhtb1009@gmail.com hoặc Hotline: 0123456789'
  }
]

function HelpCenter() {
  const [openIndices, setOpenIndices] = useState([])

  const toggleFAQ = (index) => {
    setOpenIndices((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <Box
      sx={{
        width: '100%',
        pt: 12,
        pb: 12,
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#f9f9fa',
        minHeight: '80vh'
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '1200px', px: 3, pt: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 6, textAlign: 'center', color: '#1a1a1a' }}>
          Trung tâm trợ giúp
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            backgroundColor: 'white',
            p: 4,
            borderRadius: 4,
            boxShadow: '0px 2px 10px rgba(0,0,0,0.02)'
          }}
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndices.includes(index)
            return (
              <Box key={index} sx={{ borderBottom: index !== faqs.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                <Box
                  onClick={() => toggleFAQ(index)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 3,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#fcfcfc' },
                    transition: 'background-color 0.2s',
                    px: 2
                  }}
                >
                  <Typography sx={{ fontWeight: 600, color: '#333446', fontSize: '18px' }}>{faq.question}</Typography>
                  <Box sx={{ color: '#888', display: 'flex', alignItems: 'center' }}>
                    {isOpen ? (
                      <RemoveCircleOutlineIcon sx={{ fontSize: 24, fontWeight: 'light', color: '#6B7280' }} />
                    ) : (
                      <AddCircleOutlineIcon sx={{ fontSize: 24, fontWeight: 'light', color: '#6B7280' }} />
                    )}
                  </Box>
                </Box>
                <Collapse in={isOpen}>
                  <Box sx={{ pb: 3, px: 2, pr: 6 }}>
                    <Typography sx={{ color: '#555', lineHeight: 1.6, fontSize: '16px', whiteSpace: 'pre-line' }}>
                      {faq.answer}
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}

export default HelpCenter
