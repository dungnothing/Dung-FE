import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as v from 'valibot'
import { FormProvider, useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { createSubcriptionAPI } from '~/apis/v2/subcription'
import { getUserInfoAPI } from '~/apis/auth'
import { useDispatch } from 'react-redux'
import { setUserInfo } from '~/redux/features/comon'

/* =======================
   VALIDATION SCHEMA
======================= */

const schema = v.object({
  cardName: v.pipe(v.string(), v.nonEmpty('Tên là bắt buộc')),

  cardNumber: v.pipe(v.string(), v.length(16, 'Số thẻ phải đủ 16 số')),

  cardExpiryDate: v.pipe(
    v.string(),
    v.custom((value) => {
      if (!/^\d{4}$/.test(value)) return false

      const month = parseInt(value.slice(0, 2))
      const year = parseInt('20' + value.slice(2))

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

const FormField = ({ label, children }) => (
  <Box display="flex" flexDirection="column" gap={1}>
    <Typography fontSize="0.875rem" fontWeight={500}>
      {label}
    </Typography>
    {children}
  </Box>
)

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
      cardCvv: ''
    },
    mode: 'onChange'
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting }
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
      }, 1000)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Thanh toán thất bại')
    }
  }

  return (
    <FormProvider {...form}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box
          maxWidth={400}
          px={4}
          py={5}
          border="1px solid #e0e0e0"
          borderRadius={3}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Typography variant="h6" textAlign="center">
            Credit Card Details
          </Typography>

          <Box className="border border-dashed border-gray-600 rounded-md p-3 flex items-center gap-3">
            <Typography className="text-sm">Phương thức thanh toán</Typography>
            <Box className="flex space-x-2">
              <Box className="w-10 h-6 bg-red-500 rounded" />
              <Box className="w-10 h-6 bg-blue-500 rounded" />
              <Box className="w-10 h-6 bg-cyan-500 rounded" />
            </Box>
          </Box>

          <FormField label="Tên trên thẻ">
            <Controller
              name="cardName"
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  fullWidth
                  value={field.value}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase()

                    field.onChange(value)
                  }}
                  error={!!errors.cardName}
                  helperText={errors.cardName?.message}
                />
              )}
            />
          </FormField>

          {/* Card Number */}
          <FormField label="Số thẻ">
            <Controller
              name="cardNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  fullWidth
                  placeholder="0000 0000 0000 0000"
                  value={formatCardNumber(field.value)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 16)

                    field.onChange(raw)
                  }}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber?.message}
                  inputProps={{ inputMode: 'numeric' }}
                />
              )}
            />
          </FormField>

          {/* Expiry */}
          <FormField label="Hạn sử dụng">
            <Controller
              name="cardExpiryDate"
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  fullWidth
                  placeholder="MM/YY"
                  value={formatExpiryDate(field.value)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 4)

                    field.onChange(raw)
                  }}
                  error={!!errors.cardExpiryDate}
                  helperText={errors.cardExpiryDate?.message}
                  inputProps={{ inputMode: 'numeric' }}
                />
              )}
            />
          </FormField>

          {/* CVV */}
          <FormField label="Mã bảo mật">
            <Controller
              name="cardCvv"
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  fullWidth
                  placeholder="CVV"
                  value={field.value}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 3)

                    field.onChange(value)
                  }}
                  error={!!errors.cardCvv}
                  helperText={errors.cardCvv?.message}
                  inputProps={{ inputMode: 'numeric' }}
                />
              )}
            />
          </FormField>

          {/* Package */}
          <FormField label="Gói VIP">
            <TextField size="small" fullWidth disabled value={pkg?.name} />
          </FormField>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={!isValid || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Thanh toán'}
          </Button>
        </Box>
      </Box>
    </FormProvider>
  )
}

export default PaymentForm
