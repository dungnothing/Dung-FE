import { Button, Typography, Box } from '@mui/material'
import { useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'
import { FormProvider } from 'react-hook-form'
import RHFInputCustom from '~/helpers/hook-form/RHFInputCustom'
import { updatePasswordAPI } from '~/apis/auth'
import { toast } from 'react-toastify'
import { textColor } from '~/utils/constants'

const ChangePasswordSchema = v.object({
  currentPassword: v.pipe(v.string('Mật cũ là bắt buộc'), v.nonEmpty('Mật cũ là bắt buộc')),
  newPassword: v.pipe(v.string('Mật mới là bắt buộc'), v.minLength(6, 'Mật khẩu phải có ít nhất 6 ký tự')),
  confirmPassword: v.pipe(v.string('Không được để trống'), v.minLength(6, 'Vui lòng nhập lại mật khẩu'))
})

const ChangePasswordForm = () => {
  const form = useForm({
    resolver: valibotResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    mode: 'all'
  })

  const onSubmit = async (data) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        form.setError('confirmPassword', { message: 'Mật khẩu mới không khớp' })
        return
      }
      const formData = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      }
      const res = await updatePasswordAPI(formData)
      toast.success(res.message)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <Box
      className="rounded-lg shadow-sm"
      sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff')
      }}
    >
      <Typography
        variant="h6"
        fontWeight={600}
        className="px-6 py-4"
        sx={{
          color: textColor,
          borderBottom: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#444' : '#e5e7eb'}`
        }}
      >
        Thay đổi mật khẩu
      </Typography>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-6 max-w-[400px]">
            <RHFInputCustom name="currentPassword" label="Mật khẩu hiện tại" type="password" />
            <RHFInputCustom name="newPassword" label="Mật khẩu mới" type="password" />
            <RHFInputCustom name="confirmPassword" label="Xác nhận mật khẩu" type="password" />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#6C63FF', textTransform: 'none', px: 3 }}>
              Lưu
            </Button>
            <Button
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderColor: (theme) => (theme.palette.mode === 'dark' ? '#666' : '#989898'),
                color: textColor
              }}
            >
              Hủy
            </Button>
          </div>
        </form>
      </FormProvider>

      <div className="p-6 pt-3 flex flex-col gap-2">
        <Typography variant="subtitle2" fontWeight={600} sx={{ color: textColor }}>
          Yêu cầu:
        </Typography>
        <p className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 bg-purple-500 rounded-full" />
          Tối thiểu 6 ký tự
        </p>
      </div>
    </Box>
  )
}

export default ChangePasswordForm
