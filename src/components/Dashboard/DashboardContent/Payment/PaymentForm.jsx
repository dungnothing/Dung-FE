import { Box, Button, Typography, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as v from 'valibot'
import { FormProvider, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { createSubcriptionAPI } from '~/apis/v2/subcription'
import { getUserInfoAPI } from '~/apis/auth'
import { useDispatch } from 'react-redux'
import { setUserInfo } from '~/redux/features/comon'
import RHFInputCustom from '~/helpers/hook-form/RHFInputCustom'

/* =======================
   VALIDATION SCHEMA
======================= */

const schema = v.object({
  cardName: v.pipe(v.string(), v.nonEmpty('Tên là bắt buộc')),

  cardNumber: v.pipe(
    v.string(),
    v.custom((value) => value.replace(/\D/g, '').length === 16, 'Số thẻ phải đủ 16 số')
  ),

  cardExpiryDate: v.pipe(
    v.string(),
    v.custom((value) => {
      const raw = value.replace(/\D/g, '')
      if (!/^\d{4}$/.test(raw)) return false

      const month = parseInt(raw.slice(0, 2))
      const year = parseInt('20' + raw.slice(2))

      if (month < 1 || month > 12) return false

      const expiry = new Date(year, month)
      return expiry > new Date()
    }, 'Hạn thẻ không hợp lệ')
  ),

  cardCvv: v.pipe(v.string(), v.length(3, 'CVV phải gồm 3 số'))
})

/* =======================
   FORMAT FUNCTIONS
======================= */

const formatCardNumber = (value = '') =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()

const formatExpiryDate = (value = '') => {
  const cleaned = value.replace(/\D/g, '').slice(0, 4)

  if (cleaned.length >= 3) {
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2)
  }

  return cleaned
}

/* =======================
   UI COMPONENT
======================= */

/* =======================
   MAIN COMPONENT
======================= */

function PaymentForm({ pkg, setSelectedPackage }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const form = useForm({
    resolver: valibotResolver(schema),
    defaultValues: {
      cardName: '',
      cardNumber: '',
      cardExpiryDate: '',
      cardCvv: '',
      pkgName: pkg?.name || ''
    },
    mode: 'onChange'
  })

  // Watch selected package correctly if it updates remotely
  if (pkg?.name && form.getValues('pkgName') !== pkg.name) {
    form.setValue('pkgName', pkg.name)
  }

  const {
    handleSubmit,
    formState: { isValid, isSubmitting }
  } = form

  const onSubmit = async () => {
    try {
      await createSubcriptionAPI({
        plan: pkg?.name.toUpperCase(),
        price: pkg?.priceNumber
      })

      setSelectedPackage(null)

      const userInfo = await getUserInfoAPI()
      dispatch(setUserInfo(userInfo))

      toast.success('Thanh toán thành công')
      setTimeout(() => {
        navigate('/dashboard/boards')
      }, 3000)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Thanh toán thất bại')
    }
  }

  return (
    <FormProvider {...form}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box
          maxWidth={500}
          width="100%"
          px={5}
          py={6}
          bgcolor="#ffffff"
          borderRadius={4}
          boxShadow="0 10px 40px rgba(0,0,0,0.08)"
          display="flex"
          flexDirection="column"
          gap={3}
          margin="auto"
        >
          <Box display="flex" flexDirection="column" alignItems="center" mb={1}>
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <Typography variant="h5" fontWeight="700" color="text.primary" textAlign="center">
              Thông tin thanh toán
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" mt={0.5}>
              Bảo mật và an toàn cho mọi giao dịch của bạn
            </Typography>
          </Box>

          <Box className="border border-gray-200 bg-gray-50/50 rounded-xl p-4 flex items-center justify-between mb-2">
            <Typography className="text-sm font-medium text-gray-700">Chấp nhận thanh toán</Typography>
            <Box className="flex space-x-3 items-center">
              <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-7" />
              <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-7" />
            </Box>
          </Box>

          <Box className="flex flex-col gap-6">
            <RHFInputCustom
              name="cardName"
              label="Tên in trên thẻ"
              onChange={(e, fieldOnChange) => {
                const value = e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase()
                fieldOnChange(value)
              }}
            />

            <RHFInputCustom
              name="cardNumber"
              label="Số thẻ"
              displayValue={formatCardNumber(form.watch('cardNumber'))}
              onChange={(e, fieldOnChange) => {
                const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
                fieldOnChange(raw)
              }}
            />

            <div className="flex gap-4">
              <RHFInputCustom
                name="cardExpiryDate"
                label="Hạn sử dụng (MM/YY)"
                displayValue={formatExpiryDate(form.watch('cardExpiryDate'))}
                onChange={(e, fieldOnChange) => {
                  const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
                  fieldOnChange(raw)
                }}
              />

              <RHFInputCustom
                name="cardCvv"
                label="Mã bảo mật (CVV)"
                onChange={(e, fieldOnChange) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 3)
                  fieldOnChange(value)
                }}
              />
            </div>

            <RHFInputCustom name="pkgName" label="Gói VIP đang chọn" disabled />
          </Box>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={!isValid || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(90deg, #4f46e5 0%, #3b82f6 100%)',
              boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
              '&:hover': {
                background: 'linear-gradient(90deg, #4338ca 0%, #2563eb 100%)',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)'
              },
              '&:disabled': {
                background: '#e0e0e0',
                color: '#9e9e9e',
                boxShadow: 'none'
              }
            }}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
          </Button>
        </Box>
      </Box>
    </FormProvider>
  )
}

export default PaymentForm
