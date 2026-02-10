import { Box, TextField, Button, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import validation from '~/utils/validation'
import { createSubcriptionAPI } from '~/apis/v2/subcription'
import * as v from 'valibot'
import { FormProvider, useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { getUserInfoAPI } from '~/apis/auth'
import { useDispatch } from 'react-redux'
import { setUserInfo } from '~/redux/features/comon'

const schema = v.object({
  cardName: v.pipe(
    v.string(),
    v.nonEmpty('Tên là bắt buộc'),
    v.custom((value) => !/[^\u0000-\u007E]/.test(value), 'Tên không được có dấu'),
    v.transform((value) => value.toUpperCase())
  ),
  cardNumber: v.pipe(
    v.string(),
    v.nonEmpty('Số thẻ là bắt buộc'),
    v.custom((value) => validation.isCardNumber(value), 'Số thẻ phải là 16 số')
  ),
  cardExpiryDate: v.pipe(
    v.string(),
    v.nonEmpty('Ngày hết hạn là bắt buộc'),
    v.custom((value) => validation.isCardExpiryDate(value), 'Không đúng định dạng MM/YY')
  ),
  cardCvv: v.pipe(
    v.string(),
    v.nonEmpty('CVV là bắt buộc'),
    v.custom((value) => validation.isCardCvv(value), 'CVV phải là 3 số')
  )
})

const FormField = ({ label, children }) => (
  <Box className="flex flex-col gap-2">
    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</Typography>
    {children}
  </Box>
)

const formatCardNumber = (value = '') =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()

function PaymentForm({ pkg, setSelectedPackage }) {
  const dispatch = useDispatch()

  const form = useForm({
    resolver: valibotResolver(schema),
    defaultValues: {
      cardName: '',
      cardNumber: '',
      cardExpiryDate: '',
      cardCvv: ''
    },
    mode: 'all'
  })

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = form

  const handleSubmitPayment = async () => {
    try {
      await createSubcriptionAPI({
        plan: pkg?.name.toUpperCase(),
        price: pkg?.priceNumber
      })

      setSelectedPackage(null)

      const userInfo = await getUserInfoAPI()
      dispatch(setUserInfo(userInfo))

      toast.success('Thanh toán thành công')

      window.location.href = '/dashboard/boards'
    } catch (error) {
      toast.error(error.response?.data?.message || 'Thanh toán thất bại')
    }
  }

  return (
    <FormProvider {...form}>
      <Box component="form" onSubmit={handleSubmit(handleSubmitPayment)}>
        <Box className="w-full max-w-sm px-6 py-8 rounded-xl border border-gray-700 flex flex-col gap-4">
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
            <TextField
              size="small"
              fullWidth
              {...register('cardName')}
              error={!!errors.cardName}
              helperText={errors.cardName?.message}
            />
          </FormField>

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
                  onChange={(e) => field.onChange(e.target.value.replace(/\s+/g, ''))}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber?.message}
                />
              )}
            />
          </FormField>

          <FormField label="Hạn sử dụng">
            <TextField
              size="small"
              fullWidth
              placeholder="MM/YY"
              {...register('cardExpiryDate')}
              error={!!errors.cardExpiryDate}
              helperText={errors.cardExpiryDate?.message}
            />
          </FormField>

          <FormField label="Mã bảo mật">
            <TextField
              size="small"
              fullWidth
              placeholder="CVV"
              {...register('cardCvv')}
              error={!!errors.cardCvv}
              helperText={errors.cardCvv?.message}
            />
          </FormField>

          <FormField label="Gói VIP">
            <TextField
              size="small"
              fullWidth
              disabled
              value={pkg?.name}
              sx={{
                '& .MuiInputBase-root': {
                  bgcolor: '#F7F7F7',
                  cursor: 'not-allowed'
                }
              }}
            />
          </FormField>

          <Button fullWidth variant="contained" className="bg-white text-black hover:bg-gray-200" type="submit">
            Continue
          </Button>
        </Box>
      </Box>
    </FormProvider>
  )
}

export default PaymentForm
