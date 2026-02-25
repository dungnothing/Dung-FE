import CloseIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useState } from 'react'
import ContentLoading from '~/helpers/components/ContentLoading'
import { textColor } from '~/utils/constants'
import PaymentForm from './PaymentForm'
import PaymentRequiredDialog from './PaymentRequiredDialog'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const PaymentComponent = () => {
  const [selectedPackage, setSelectedPackage] = useState(null)
  const user = useSelector((state) => state.comon.user)
  const supData = user?.subscriptions
  const location = useLocation()
  const [dialogOpen, setDialogOpen] = useState(!!location.state?.showPaymentDialog)
  // subscriptions có thể là {} (object rỗng) khi user chưa có gói nào
  // cần check thêm có plan hợp lệ không
  const hasValidSubscription = !!(supData?.plan && supData?.expiresAt)

  const packages = [
    {
      id: 1,
      name: 'Pro',
      price: '6.99$',
      limitedBoard: false,
      limitedMember: false,
      support: false,
      bdcolor: '#FF9D00',
      priceNumber: 7
    },
    {
      id: 2,
      name: 'Premium',
      price: '11.99$',
      limitedBoard: false,
      limitedMember: false,
      support: true,
      bdcolor: '#3A6F43',
      priceNumber: 12
    }
  ]

  const FeatureItem = ({ label, enabled }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography>{label}</Typography>
      {enabled ? <DoneIcon color="success" /> : <CloseIcon color="error" />}
    </Box>
  )

  const getRemainingDays = (expiresAt) => {
    const now = dayjs()
    const expire = dayjs(expiresAt)
    const diff = expire.diff(now, 'day')
    return diff > 0 ? diff : 0
  }

  return (
    <Box className="flex flex-col p-4 gap-4">
      <Typography variant="h4" sx={{ color: textColor, fontWeight: 600 }}>
        Nâng cấp tài khoản lên VIP
      </Typography>

      {/* Hiển thị loading khi đang tải */}
      {!user ? (
        <ContentLoading message="Đang tải thông tin gói..." minHeight="400px" />
      ) : (
        <Box sx={{ display: 'flex', gap: 3, width: '100%', maxHeight: '366px' }}>
          {/* Gói nâng cấp */}
          <Box sx={{ display: 'flex', gap: 2, flex: 2 }}>
            {packages.map((pkg) => {
              const isExpired = hasValidSubscription && new Date(supData?.expiresAt) < new Date()
              const currentPlan = hasValidSubscription ? supData?.plan : null
              const isCurrentPkg = currentPlan === pkg?.name.toUpperCase() && !isExpired
              const remainingDays = isCurrentPkg ? getRemainingDays(supData.expiresAt) : null

              const isPremiumDowngrade = currentPlan === 'PREMIUM' && !isExpired && pkg?.name === 'Pro'
              const canBuy =
                !hasValidSubscription || isExpired || (currentPlan === 'PRO' && !isExpired && pkg?.name === 'Premium')
              const isActive = !isPremiumDowngrade && (canBuy || isCurrentPkg)
              const buttonText =
                currentPlan === 'PRO' && !isExpired && pkg?.name === 'Premium' ? 'Nâng cấp ngay' : 'Thanh toán ngay'

              return (
                <Card
                  key={pkg?.id}
                  sx={{
                    flex: 1,
                    borderRadius: '16px',
                    border: isCurrentPkg ? `2px solid ${pkg?.bdcolor}` : '2px solid #E5E7EB',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: '0.25s',
                    opacity: isActive ? 1 : 0.45,
                    boxShadow: isCurrentPkg ? `0 4px 20px ${pkg?.bdcolor}30` : 'none',
                    '&:hover': {
                      transform: isActive ? 'translateY(-4px)' : 'none',
                      boxShadow: isActive ? '0 6px 20px rgba(0,0,0,0.08)' : 'none'
                    }
                  }}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3, flex: 1 }}>
                    {/* Header: Icon + Badge */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: 'white',
                          borderRadius: '50%',
                          border: `8px solid ${pkg?.bdcolor}`
                        }}
                      />
                    </Box>

                    {/* Tên và giá */}
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {pkg?.name}
                    </Typography>
                    <Box
                      sx={{ display: 'flex', alignItems: 'end', gap: 0.5, borderBottom: '1px solid #E5E7EB', pb: 1 }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {pkg?.price}
                      </Typography>
                      <Typography sx={{ pb: '4px', color: 'text.secondary' }}>/tháng</Typography>
                    </Box>

                    {/* Tính năng */}
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <FeatureItem label="Không giới hạn thành viên" enabled={!pkg?.limitedMember} />
                      <FeatureItem label="Không giới hạn bảng" enabled={!pkg?.limitedBoard} />
                      <FeatureItem label="Hỗ trợ chăm sóc khách hàng" enabled={pkg?.support} />
                    </Box>

                    {/* Nút hoặc thông tin còn lại */}
                    {isCurrentPkg ? (
                      <Box
                        sx={{
                          mt: 'auto',
                          py: 1,
                          px: 2,
                          bgcolor: `${pkg?.bdcolor}10`,
                          borderRadius: '10px',
                          textAlign: 'center',
                          border: `1px dashed ${pkg?.bdcolor}60`
                        }}
                      >
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: pkg?.bdcolor }}>
                          Còn {remainingDays} ngày sử dụng
                        </Typography>
                      </Box>
                    ) : canBuy ? (
                      <Button
                        fullWidth
                        variant={pkg?.id === 2 ? 'contained' : 'outlined'}
                        onClick={() => setSelectedPackage(pkg)}
                        sx={{
                          mt: 'auto',
                          height: '40px',
                          borderRadius: '10px',
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '0.9rem',
                          backgroundColor: pkg?.id === 2 ? '#615FFF' : 'transparent',
                          color: pkg?.id === 2 ? '#fff' : '#615FFF',
                          borderColor: '#615FFF',
                          '&:hover': {
                            backgroundColor: pkg?.id === 2 ? '#4E4BFF' : 'rgba(97,95,255,0.08)'
                          }
                        }}
                      >
                        {buttonText}
                      </Button>
                    ) : (
                      <Box sx={{ height: '40px' }} />
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </Box>

          {/* Form thanh toán */}
          <Box sx={{ flex: 1 }}>
            {selectedPackage && <PaymentForm pkg={selectedPackage} setSelectedPackage={setSelectedPackage} />}
          </Box>
        </Box>
      )}
      <PaymentRequiredDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Box>
  )
}

export default PaymentComponent
