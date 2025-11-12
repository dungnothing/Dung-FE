import { Box, TextField, Button, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import validation from '~/utils/validation'
import { createSubcriptionAPI } from '~/apis/subcription'
import * as v from 'valibot'
import { FormProvider, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

const schema = v.object({
  cardName: v.pipe(
    v.string(),
    v.nonEmpty('Tên là bắt buộc'),
    v.custom((value) => {
      // Kiểm tra có dấu không
      const hasDiacritics = /[^\u0000-\u007E]/.test(value) // ký tự ngoài ASCII
      if (hasDiacritics) return false
      return true
    }, 'Tên không được có dấu'),
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

function CreditCardForm({ pkg, getUserSubsription, setSelectedPackage }) {
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
    handleSubmit,
    formState: { errors }
  } = form

  const handleSubmitPayment = async () => {
    try {
      await createSubcriptionAPI({
        plan: pkg?.name.toUpperCase(),
        price: pkg?.priceNumber
      })
      getUserSubsription()
      setSelectedPackage(null)
      toast.success('Thanh toán thành công')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Thanh toán thất bại')
    }
  }

  return (
    <FormProvider {...form}>
      <Box component="form" onSubmit={handleSubmit(handleSubmitPayment)}>
        <Box className="w-full max-w-sm px-6 py-8 rounded-xl border border-gray-700 flex flex-col gap-3">
          <Box className="flex items-center">
            <Typography variant="h6" className="flex-grow text-center -ml-6">
              Credit Card Details
            </Typography>
          </Box>

          <Box className="border border-dashed border-gray-600 rounded-md p-3 flex items-center">
            <Typography className="text-sm mb-2 max-w-[90px]">Phương thức thanh toán</Typography>
            <Box className="flex space-x-2">
              <Box className="w-10 h-6 bg-red-500 rounded" />
              <Box className="w-10 h-6 bg-blue-500 rounded" />
              <Box className="w-10 h-6 bg-cyan-500 rounded" />
            </Box>
          </Box>

          {/* Card Name */}
          <Box className="flex flex-col gap-2">
            <Typography className="text-sm mb-2 max-w-[90px]">Tên trên thẻ</Typography>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              {...register('cardName')}
              error={!!errors.cardName}
              helperText={errors.cardName?.message}
            />
          </Box>

          {/* Card Number */}
          <Box className="flex flex-col gap-2">
            <Typography className="text-sm mb-2 max-w-[90px]">Số thẻ</Typography>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              placeholder="0000 0000 0000 0000"
              {...register('cardNumber')}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber?.message}
            />
          </Box>

          {/* Expiration */}
          <Box className="flex flex-col gap-2">
            <Typography className="text-sm mb-2 max-w-[90px]">Hạn sử dụng</Typography>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              placeholder="MM/YY"
              {...register('cardExpiryDate')}
              error={!!errors.cardExpiryDate}
              helperText={errors.cardExpiryDate?.message}
            />
          </Box>

          {/* CVV */}
          <Box className="flex flex-col gap-2">
            <Typography className="text-sm mb-2 max-w-[90px]">Mã bảo mật</Typography>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              placeholder="Code"
              {...register('cardCvv')}
              error={!!errors.cardCvv}
              helperText={errors.cardCvv?.message}
            />
          </Box>

          {/* Package */}
          <Box className="flex flex-col gap-2">
            <Typography className="text-sm mb-2 max-w-[90px]">Gói VIP</Typography>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              disabled
              value={pkg?.name}
              sx={{
                '& .MuiInputBase-root': {
                  bgcolor: '#F7F7F7',
                  borderColor: '#DCDCDC',
                  cursor: 'not-allowed'
                }
              }}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            className="bg-white text-black hover:bg-gray-200 rounded-md py-2"
            type="submit"
          >
            Continue
          </Button>
        </Box>
      </Box>
    </FormProvider>
  )
}

export default CreditCardForm
