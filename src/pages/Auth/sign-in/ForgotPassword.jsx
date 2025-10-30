import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { forgotPasswordAPI } from '~/apis/auth'
import { toast } from 'react-toastify'
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'
import RHFInputCustom from '~/helpers/hook-form/RHFInputCustom'
import { useForm, FormProvider } from 'react-hook-form'

const schema = v.object({
  email: v.pipe(v.string('Email là bắt buộc'), v.nonEmpty('Email là bắt buộc'), v.email('Email không hợp lệ'))
})

function ForgotPassword({ open, handleClose }) {
  const form = useForm({
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: {
      email: ''
    }
  })
  const { handleSubmit } = form

  const onSubmit = async (data) => {
    try {
      const response = await forgotPasswordAPI({ email: data.email })
      if (response && response.status === 200) {
        toast.success('Check email của bạn để reset password nhé!')
        handleClose()
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'Có lỗi xảy ra!')
      } else {
        toast.error('Không thể kết nối với server. Vui lòng thử lại sau!')
      }
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Quên mật khẩu </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <DialogContentText>
              Điền vào email của bạn. Chúng tôi sẽ gửi mật khẩu mới tới email của bạn.
            </DialogContentText>
            <RHFInputCustom name="email" label="Email" />
          </DialogContent>
          <DialogActions sx={{ pb: 3, px: 3 }}>
            <Button
              variant="contained"
              type="button"
              onClick={handleSubmit}
              sx={{ bgcolor: '#6733F7' }}
              disabled={!form.formState.isValid}
            >
              Gửi
            </Button>
            <Button
              onClick={() => {
                handleClose()
                form.reset({ email: '' })
              }}
            >
              Hủy
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  )
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export default ForgotPassword
