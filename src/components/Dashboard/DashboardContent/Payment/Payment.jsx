import { useState, useEffect } from 'react'
import { Box, Card, CardContent, Typography, Button, CircularProgress } from '@mui/material'
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
import PaymentForm from './PaymentForm'
import { textColor } from '~/utils/constants'
import { getSubcriptionAPI } from '~/apis/v2/subcription'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

const PaymentComponent = () => {
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [supData, setSupData] = useState(null)
  const [loading, setLoading] = useState(true)

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

  const getUserSubsription = async () => {
    try {
      setLoading(true)
      const res = await getSubcriptionAPI()
      setSupData(res)
    } catch (error) {
      toast.error('Lỗi khi lấy thông tin người dùng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserSubsription()
  }, [])

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
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            minHeight: '400px'
          }}
        >
          <CircularProgress />
          <Typography>Đang tải thông tin gói...</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 3, width: '100%' }}>
          {/* Gói nâng cấp */}
          <Box sx={{ display: 'flex', gap: 3, flex: 2 }}>
            {packages.map((pkg) => {
              const isSubscribed = supData?.plan === pkg?.name.toUpperCase()
              const remainingDays = isSubscribed ? getRemainingDays(supData.expiresAt) : null
              const noSubscription = !supData // chưa có gói nào

              // Logic nâng cấp: Nếu đang dùng PRO thì có thể mua PREMIUM
              const isPro = supData?.plan === 'PRO'
              const canUpgrade = isPro && pkg?.name === 'Premium'

              // Điều kiện để hiển thị active (không bị mờ)
              const isActive = noSubscription || isSubscribed || canUpgrade

              return (
                <Card
                  key={pkg?.id}
                  sx={{
                    flex: 1,
                    borderRadius: '20px',
                    border: '1px solid #E5E7EB',
                    transition: '0.3s',
                    opacity: isActive ? 1 : 0.4,
                    '&:hover': {
                      transform: isActive ? 'translateY(-4px)' : 'none',
                      boxShadow: isActive ? '0 6px 20px rgba(0,0,0,0.08)' : 'none'
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
                        border: `9px solid ${pkg?.bdcolor}`,
                        mb: 1
                      }}
                    />

                    {/* Tên và giá */}
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {pkg?.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'end', gap: 0.5 }}>
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

                    {/* Nút thanh toán hoặc thông tin gói hiện tại */}
                    {isSubscribed ? (
                      <Typography sx={{ mt: 2, fontWeight: 600, textAlign: 'center', color: textColor }}>
                        Gói này còn {remainingDays} ngày
                      </Typography>
                    ) : noSubscription || canUpgrade ? (
                      <Button
                        fullWidth
                        variant={pkg?.id === 2 ? 'contained' : 'outlined'}
                        onClick={() => setSelectedPackage(pkg)}
                        sx={{
                          mt: 2,
                          borderRadius: '12px',
                          backgroundColor: pkg?.id === 2 ? '#615FFF' : 'transparent',
                          color: pkg?.id === 2 ? '#fff' : '#615FFF',
                          borderColor: '#615FFF',
                          '&:hover': {
                            backgroundColor: pkg?.id === 2 ? '#4E4BFF' : 'rgba(97,95,255,0.1)'
                          }
                        }}
                      >
                        {canUpgrade ? 'Nâng cấp ngay' : 'Thanh toán ngay'}
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              )
            })}
          </Box>

          {/* Form thanh toán */}
          <Box sx={{ flex: 1 }}>
            {selectedPackage && (
              <PaymentForm
                pkg={selectedPackage}
                getUserSubsription={getUserSubsription}
                setSelectedPackage={setSelectedPackage}
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default PaymentComponent
