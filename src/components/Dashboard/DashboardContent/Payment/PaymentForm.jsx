import {
  Box,
  TextField,
  Button,
  Typography
} from '@mui/material'
import { toast } from 'react-toastify'
import { updateVipAPI } from '~/apis/auth'
import { useState } from 'react'
import validation from '~/utils/validation'
import { useDispatch } from 'react-redux'
import { updateUserInfo } from '~/redux/features/comon'

function CreditCardForm({ pkg }) {
  const dispatch = useDispatch()
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiryDate, setCardExpiryDate] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!validation.isCardName(cardName)) {
      newErrors.cardName = 'Tên chủ thẻ không hợp lệ'
    }

    if (!validation.isCardNumber(cardNumber)) {
      newErrors.cardNumber = 'Số thẻ không hợp lệ (16 chữ số)'
    }

    if (!validation.isCardExpiryDate(cardExpiryDate)) {
      newErrors.cardExpiryDate = 'Ngày hết hạn không hợp lệ (MM/YY)'
    } else {
      // Additional expiry date validation
      const [month, year] = cardExpiryDate.split('/')
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1)
      const currentDate = new Date()
      if (expiryDate < currentDate) {
        newErrors.cardExpiryDate = 'Thẻ đã hết hạn'
      }
    }

    if (!validation.isCardCvv(cardCvv)) {
      newErrors.cardCvv = 'Mã bảo mật không hợp lệ (3 chữ số)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitPayment = async (e) => {
    e?.preventDefault()
    if (!validateForm()) {
      return
    }
    try {
      await updateVipAPI({ vip: true })
      dispatch(updateUserInfo({ vip: true }))
      toast.success('Thanh toán thành công')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Thanh toán thất bại')
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmitPayment}>
      <Box className="w-full max-w-sm px-6 py-8 rounded-xl border border-gray-700 flex flex-col gap-3">
        {/* Header */}
        <Box className="flex items-center">
          <Typography variant="h6" className="flex-grow text-center -ml-6">
            Credit Card Details
          </Typography>
        </Box>

        {/* Payment Method (placeholder icons) */}
        <Box className="border border-dashed border-gray-600 rounded-md p-3 flex items-center">
          <Typography className="text-sm mb-2 max-w-[90px]">Phương thức thanh toán</Typography>
          <Box className="flex space-x-2">
            {/* Bạn có thể thay bằng icon thực tế hoặc hình ảnh */}
            <Box className="w-10 h-6 bg-red-500 rounded" />
            <Box className="w-10 h-6 bg-blue-500 rounded" />
            <Box className="w-10 h-6 bg-cyan-500 rounded" />
          </Box>
        </Box>

        {/* Form Fields */}
        <Box className="flex flex-col gap-2">
          <Typography className="text-sm mb-2 max-w-[90px]">Tên trên thẻ</Typography>
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            InputLabelProps={{ style: { color: '#aaa' } }}
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            error={!!errors.cardName}
            helperText={errors.cardName}
          />
        </Box>
        <Box className="flex flex-col gap-2">
          <Typography className="text-sm mb-2 max-w-[90px]">Số thẻ</Typography>
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            placeholder="0000 0000 0000 0000"
            InputLabelProps={{ style: { color: '#aaa' } }}
            error={!!errors.cardNumber}
            helperText={errors.cardNumber}
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
          />
        </Box>

        {/* Expiration */}
        <Typography className="text-sm mb-2 max-w-[90px]">Hạn sử dụng</Typography>
        <TextField
          variant="outlined"
          fullWidth
          size="small"
          placeholder="MM/YY"
          value={cardExpiryDate}
          onChange={(e) => {
            let value = e.target.value.replace(/[^\d]/g, '')
            if (value.length > 2) {
              value = value.slice(0, 2) + '/' + value.slice(2, 4)
            } else if (value.length === 2) {
              value = value + '/'
            }
            setCardExpiryDate(value)
          }}
          error={!!errors.cardExpiryDate}
          helperText={errors.cardExpiryDate}
          InputLabelProps={{ style: { color: '#aaa' } }}
        />

        <Box className="flex flex-col gap-2">
          <Typography className="text-sm mb-2 max-w-[90px]">Mã bảo mật</Typography>
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            placeholder="Code"
            InputLabelProps={{ style: { color: '#aaa' } }}
            value={cardCvv}
            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
            error={!!errors.cardCvv}
            helperText={errors.cardCvv}
          />
        </Box>

        <Box className="flex flex-col gap-2">
          <Typography className="text-sm mb-2 max-w-[90px]">Gói VIP</Typography>
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            disabled
            value={pkg.name}
            sx={{
              '& .MuiInputBase-root': {
                bgcolor: '#F7F7F7',
                borderColor: '#DCDCDC',
                cursor: 'not-allowed'
              }
            }}
          />
        </Box>

        {/* Submit Button */}
        <Button
          fullWidth
          type="submit"
          variant="contained"
          className="bg-white text-black hover:bg-gray-200 rounded-md py-2"
        >
          Continue
        </Button>
      </Box>
    </Box>
  )
}

export default CreditCardForm
