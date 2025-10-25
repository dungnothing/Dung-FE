import { useState } from 'react'
import { Box, Card, CardContent, Typography, Button } from '@mui/material'
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
import PaymentForm from '../../components/Dashboard/DashboardContent/Payment/PaymentForm'
import { textColor } from '~/utils/constants'

const PaymentComponent = () => {
  const [isChoose, setIsChoose] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)

  const packages = [
    {
      id: 1,
      name: 'Basic',
      price: '29.99$',
      limitedBoard: false,
      limitedMember: false,
      support: false,
      bdcolor: '#FF9D00'
    },
    {
      id: 2,
      name: 'Pro',
      price: '49.99$',
      limitedBoard: false,
      limitedMember: false,
      support: true,
      bdcolor: '#3A6F43'
    }
  ]

  const FeatureItem = ({ label, enabled }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography>{label}</Typography>
      {enabled ? <DoneIcon color="success" /> : <CloseIcon color="error" />}
    </Box>
  )

  const handleChoose = (pkg) => {
    setSelectedPackage(pkg)
    setIsChoose(true)
  }

  return (
    <Box className="flex flex-col p-4 gap-4">
      <Typography variant="h4" sx={{ color: textColor, fontWeight: 600 }}>
        Nâng cấp tài khoản lên VIP
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, width: '100%' }}>
        {/* Gói nâng cấp */}
        <Box sx={{ display: 'flex', gap: 3, flex: 2 }}>
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              sx={{
                flex: 1,
                borderRadius: '20px',
                border: '1px solid #E5E7EB',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.08)'
                }
              }}
            >
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {/* Icon */}
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    bgcolor: 'white',
                    borderRadius: '50%',
                    border: `9px solid ${pkg.bdcolor}`,
                    mb: 1
                  }}
                />

                {/* Tên và giá */}
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {pkg.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'end', gap: 0.5 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {pkg.price}
                  </Typography>
                  <Typography sx={{ pb: '4px', color: 'text.secondary' }}>/năm</Typography>
                </Box>

                {/* Tính năng */}
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FeatureItem label="Không giới hạn thành viên" enabled={!pkg.limitedMember} />
                  <FeatureItem label="Không giới hạn bảng" enabled={!pkg.limitedBoard} />
                  <FeatureItem label="Hỗ trợ chăm sóc khách hàng" enabled={pkg.support} />
                </Box>

                {/* Nút thanh toán */}
                <Button
                  fullWidth
                  variant={pkg.id === 2 ? 'contained' : 'outlined'}
                  onClick={() => handleChoose(pkg)}
                  sx={{
                    mt: 2,
                    borderRadius: '12px',
                    backgroundColor: pkg.id === 2 ? '#615FFF' : 'transparent',
                    color: pkg.id === 2 ? '#fff' : '#615FFF',
                    borderColor: '#615FFF',
                    '&:hover': {
                      backgroundColor: pkg.id === 2 ? '#4E4BFF' : 'rgba(97,95,255,0.1)'
                    }
                  }}
                >
                  Thanh toán ngay
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Form thanh toán */}
        <Box sx={{ flex: 1 }}>{isChoose && <PaymentForm pkg={selectedPackage} />}</Box>
      </Box>
    </Box>
  )
}

export default PaymentComponent
