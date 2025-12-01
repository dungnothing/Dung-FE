import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { toast } from 'react-toastify'
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'
import RHFInputCustom from '~/helpers/hook-form/RHFInputCustom'
import { useForm, FormProvider } from 'react-hook-form'
import { useState } from 'react'
import { forgotPasswordAPI, verifyOtpAPI, resetPasswordAPI } from '~/apis/auth'

// Schema từng bước
const emailSchema = v.object({
  email: v.pipe(v.string('Email là bắt buộc'), v.nonEmpty('Email là bắt buộc'), v.email('Email không hợp lệ'))
})

const otpSchema = v.object({
  otp: v.pipe(v.string('OTP là bắt buộc'), v.nonEmpty('OTP là bắt buộc'))
})

const passwordSchema = v.object({
  password: v.pipe(v.string('Mật khẩu là bắt buộc'), v.minLength(6, 'Tối thiểu 6 ký tự')),
  confirmPassword: v.pipe(v.string('Mật khẩu là bắt buộc'), v.minLength(6, 'Tối thiểu 6 ký tự'))
})

function ForgotPassword({ open, handleClose }) {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [validateOption, setValidateOption] = useState()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: valibotResolver(validateOption || emailSchema),
    mode: 'all',
    defaultValues: { email: '' }
  })

  const { handleSubmit, reset } = form
  const handleSendEmail = async (data) => {
    try {
      setLoading(true)
      await forgotPasswordAPI({ email: data.email })
      toast.success('OTP đã được gửi tới email của bạn!')
      setEmail(data.email)
      setStep(2)
      setValidateOption(otpSchema)
      reset({ otp: '' })
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi gửi OTP!')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (data) => {
    try {
      setLoading(true)
      await verifyOtpAPI({ email, otp: data.otp })
      setOtp(data.otp)
      setStep(3)
      setValidateOption(passwordSchema)
      reset({ password: '', confirmPassword: '' })
    } catch (error) {
      toast.error(error?.response?.data?.message || 'OTP không hợp lệ!')
      reset({ otp: '' })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        form.setError('confirmPassword', { message: 'Mật khẩu mới không khớp' })
        return
      }
      await resetPasswordAPI({ email, password: data.password, otp: otp })
      toast.success('Đặt lại mật khẩu thành công!')
      handleClose()
      setStep(1)
      setValidateOption(emailSchema)
      reset({ email: '' })
      setOtp('')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể đặt lại mật khẩu!')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = (data) => {
    switch (step) {
      case 1:
        handleSendEmail(data)
        break
      case 2:
        handleVerifyOtp(data)
        break
      case 3:
        handleResetPassword(data)
        break
      default:
        break
    }
  }

  const handleCancel = () => {
    handleClose()
    setStep(1)
    setValidateOption(emailSchema)
    reset({ email: '' })
  }

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Quên mật khẩu</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            {step === 1 && (
              <>
                <DialogContentText>Nhập email của bạn để nhận mã OTP.</DialogContentText>
                <RHFInputCustom name="email" label="Email" />
              </>
            )}

            {step === 2 && (
              <>
                <DialogContentText>Nhập mã OTP được gửi tới email của bạn.</DialogContentText>
                <RHFInputCustom name="otp" label="Mã OTP" />
              </>
            )}

            {step === 3 && (
              <>
                <DialogContentText>Đặt lại mật khẩu mới của bạn.</DialogContentText>
                <RHFInputCustom name="password" label="Mật khẩu mới" type="password" />
                <RHFInputCustom name="confirmPassword" label="Xác nhận mật khẩu" type="password" />
              </>
            )}
          </DialogContent>

          <DialogActions sx={{ pb: 3, px: 3 }}>
            <Button
              variant="contained"
              type="submit"
              sx={{ bgcolor: '#6733F7' }}
              disabled={!form.formState.isValid}
              loading={loading}
            >
              {step === 1 ? 'Gửi OTP' : step === 2 ? 'Xác minh' : 'Đặt lại'}
            </Button>
            <Button onClick={handleCancel}>Hủy</Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  )
}

export default ForgotPassword
