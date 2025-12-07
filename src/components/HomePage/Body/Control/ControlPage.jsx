import { Box, Button, Container, Typography, Grid, Card, Chip } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useNavigate } from 'react-router-dom'

function ControlPage() {
  const navigate = useNavigate()

  const features = [
    'Quản lý boards không giới hạn',
    'Tùy chỉnh không cần code',
    'Tổng quan cấp cao',
    'Báo cáo cơ bản & nâng cao',
    'Theo dõi thời gian thực'
  ]

  return (
    <Box
      sx={{
        pt: 8,
        minHeight: '100vh',
        bgcolor: '#F6F7FB',
        overflow: 'auto'
      }}
    >
      {/* Hero Section */}
      <Container sx={{ py: 8, width: '100%' }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="overline"
            sx={{
              color: '#6161FF',
              fontWeight: 600,
              fontSize: '14px',
              letterSpacing: '1px',
              mb: 2,
              display: 'block'
            }}
          >
            Bảng điều khiển
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '32px', md: '48px' },
              color: '#323338',
              mb: 3,
              lineHeight: 1.2
            }}
          >
            Theo dõi tiến độ và thúc đẩy kết quả
            <br />
            với <span style={{ color: '#6161FF' }}>bảng điều khiển</span>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#676879',
              fontSize: '18px',
              fontWeight: 400,
              mb: 4,
              maxWidth: '700px',
              mx: 'auto'
            }}
          >
            Đưa ra quyết định công việc thông minh hơn với sự trợ giúp của thông tin chi tiết dựa trên dữ liệu.
          </Typography>

          {/* Feature Pills */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: 'center',
              mb: 4
            }}
          >
            {features.map((feature, index) => (
              <Chip
                key={index}
                icon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
                label={feature}
                sx={{
                  bgcolor: 'white',
                  color: '#323338',
                  fontWeight: 500,
                  px: 1,
                  py: 2.5,
                  fontSize: '14px',
                  '& .MuiChip-icon': {
                    color: '#00CA72'
                  }
                }}
              />
            ))}
          </Box>

          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/sign-up')}
            sx={{
              bgcolor: '#6161FF',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: '50px',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(97, 97, 255, 0.3)',
              '&:hover': {
                bgcolor: '#5050EE',
                boxShadow: '0 6px 16px rgba(97, 97, 255, 0.4)'
              }
            }}
          >
            Bắt đầu ngay
          </Button>
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'white', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="overline"
                sx={{
                  color: '#6161FF',
                  fontWeight: 600,
                  fontSize: '12px',
                  letterSpacing: '1px',
                  mb: 2,
                  display: 'block'
                }}
              >
                TỔNG QUAN CẤP CAO
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '28px', md: '36px' },
                  color: '#323338',
                  mb: 3
                }}
              >
                Nhận thông tin chi tiết theo thời gian thực
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#676879',
                  fontSize: '16px',
                  lineHeight: 1.7,
                  mb: 4
                }}
              >
                Dễ dàng phân tích dữ liệu của bạn và đơn giản hóa việc ra quyết định chiến lược với bảng điều khiển tùy
                chỉnh. Chạy báo cáo, tạo tóm tắt, theo dõi tiến độ và có cái nhìn tổng quan cấp cao về toàn bộ tổ chức
                của bạn.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  bgcolor: '#F6F7FB',
                  borderRadius: '16px',
                  p: 4,
                  boxShadow: 'none'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#323338' }}>
                  Tổng quan phòng ban
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ bgcolor: 'white', p: 2, borderRadius: '8px' }}>
                      <Typography variant="caption" sx={{ color: '#676879', display: 'block', mb: 1 }}>
                        Ngân sách tháng
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#323338' }}>
                        $1,486,641
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ bgcolor: 'white', p: 2, borderRadius: '8px' }}>
                      <Typography variant="caption" sx={{ color: '#676879', display: 'block', mb: 1 }}>
                        Chi tiêu tháng
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#323338' }}>
                        $180,700
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ bgcolor: 'white', p: 2, borderRadius: '8px', height: '120px' }}>
                      <Typography variant="caption" sx={{ color: '#676879', display: 'block', mb: 2 }}>
                        Tổng quan tiến độ nhóm
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          height: '60px',
                          alignItems: 'flex-end'
                        }}
                      >
                        {[40, 65, 45, 80, 55, 70, 50, 85].map((height, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              flex: 1,
                              bgcolor: ['#00CA72', '#FDAB3D', '#E2445C', '#579BFC'][idx % 4],
                              height: `${height}%`,
                              borderRadius: '4px 4px 0 0'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Customization Section */}
      <Box sx={{ bgcolor: '#F6F7FB', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <Card
                sx={{
                  bgcolor: 'white',
                  borderRadius: '16px',
                  p: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#323338' }}>
                  Bảng điều khiển bán hàng
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ bgcolor: '#F6F7FB', p: 2, borderRadius: '8px' }}>
                      <Typography variant="caption" sx={{ color: '#676879', display: 'block', mb: 1 }}>
                        Doanh thu dự kiến
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#323338' }}>
                        $211,800
                      </Typography>
                      <Box sx={{ height: '60px', mt: 2, display: 'flex', gap: 0.5, alignItems: 'flex-end' }}>
                        {[30, 50, 70, 45, 60].map((h, i) => (
                          <Box
                            key={i}
                            sx={{
                              flex: 1,
                              bgcolor: '#579BFC',
                              height: `${h}%`,
                              borderRadius: '2px 2px 0 0'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ bgcolor: '#F6F7FB', p: 2, borderRadius: '8px', mb: 2 }}>
                      <Typography variant="caption" sx={{ color: '#676879', display: 'block', mb: 1 }}>
                        Quy trình bán hàng
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#323338' }}>
                        $69,700
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        bgcolor: '#F6F7FB',
                        p: 2,
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '80px'
                      }}
                    >
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: 'conic-gradient(#00CA72 0% 65%, #FDAB3D 65% 85%, #E2445C 85% 100%)'
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
              <Typography
                variant="overline"
                sx={{
                  color: '#6161FF',
                  fontWeight: 600,
                  fontSize: '12px',
                  letterSpacing: '1px',
                  mb: 2,
                  display: 'block'
                }}
              >
                TÙY CHỈNH BẢNG ĐIỀU KHIỂN
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '28px', md: '36px' },
                  color: '#323338',
                  mb: 3
                }}
              >
                Xem dữ liệu theo cách của bạn
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#676879',
                  fontSize: '16px',
                  lineHeight: 1.7
                }}
              >
                Xây dựng các công cụ báo cáo bạn cần cho doanh nghiệp của mình với bảng điều khiển tùy chỉnh không cần
                code. Thêm các widget như biểu đồ và dòng thời gian để giúp trực quan hóa dữ liệu của bạn và cập nhật
                tiến độ cũng như kết quả.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Resource Management Section */}
      <Box sx={{ bgcolor: 'white', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="overline"
                sx={{
                  color: '#6161FF',
                  fontWeight: 600,
                  fontSize: '12px',
                  letterSpacing: '1px',
                  mb: 2,
                  display: 'block'
                }}
              >
                QUẢN LÝ NGUỒN LỰC
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '28px', md: '36px' },
                  color: '#323338',
                  mb: 3
                }}
              >
                Ưu tiên công việc thông minh hơn
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#676879',
                  fontSize: '16px',
                  lineHeight: 1.7,
                  mb: 4
                }}
              >
                Thích ứng với những thay đổi và ưu tiên khối lượng công việc một cách hiệu quả. Giám sát năng lực nhóm,
                theo dõi tiến độ dự án, và phân bổ nguồn lực nơi chúng cần thiết nhất.
              </Typography>
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/sign-up')}
                sx={{
                  borderColor: '#6161FF',
                  color: '#6161FF',
                  px: 3,
                  py: 1,
                  fontSize: '14px',
                  fontWeight: 600,
                  borderRadius: '50px',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#5050EE',
                    bgcolor: 'rgba(97, 97, 255, 0.05)'
                  }
                }}
              >
                Tìm hiểu thêm
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  bgcolor: '#F6F7FB',
                  borderRadius: '16px',
                  p: 4,
                  boxShadow: 'none'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#323338' }}>
                  Khối lượng công việc nhóm
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {['Eddie', 'Sarah', 'Mike'].map((name, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          bgcolor: ['#E2445C', '#00CA72', '#579BFC'][idx],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '14px'
                        }}
                      >
                        {name[0]}
                      </Box>
                      <Typography sx={{ width: '80px', color: '#323338', fontWeight: 500 }}>{name}</Typography>
                      <Box sx={{ flex: 1, display: 'flex', gap: 1 }}>
                        {[60, 20, 15].map((width, i) => (
                          <Box
                            key={i}
                            sx={{
                              width: `${width}%`,
                              height: '24px',
                              bgcolor: ['#E2445C', '#C4C4C4', '#579BFC'][i],
                              borderRadius: '4px'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ mt: 3, bgcolor: 'white', p: 2, borderRadius: '8px' }}>
                  <Typography variant="caption" sx={{ color: '#676879', display: 'block', mb: 2 }}>
                    Tổng quan tiến độ nhóm
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Box sx={{ width: '40%', height: '32px', bgcolor: '#00CA72', borderRadius: '4px' }} />
                    <Box sx={{ width: '25%', height: '32px', bgcolor: '#E2445C', borderRadius: '4px' }} />
                    <Box sx={{ width: '35%', height: '32px', bgcolor: '#C4C4C4', borderRadius: '4px' }} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2, fontSize: '12px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, bgcolor: '#00CA72', borderRadius: '2px' }} />
                      <Typography variant="caption">8 Hoàn thành</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, bgcolor: '#E2445C', borderRadius: '2px' }} />
                      <Typography variant="caption">Đang làm</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, bgcolor: '#C4C4C4', borderRadius: '2px' }} />
                      <Typography variant="caption">Bị kẹt</Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: '#6161FF',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '28px', md: '36px' },
              color: 'white',
              mb: 3
            }}
          >
            Sẵn sàng chuyển đổi quy trình làm việc của bạn?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '18px',
              mb: 4
            }}
          >
            Tham gia cùng hàng nghìn nhóm đang sử dụng nền tảng của chúng tôi để thúc đẩy kết quả
          </Typography>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/sign-up')}
            sx={{
              bgcolor: 'white',
              color: '#6161FF',
              px: 4,
              py: 1.5,
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: '50px',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '&:hover': {
                bgcolor: '#F6F7FB',
                boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
              }
            }}
          >
            Bắt đầu miễn phí
          </Button>
        </Container>
      </Box>
    </Box>
  )
}

export default ControlPage
