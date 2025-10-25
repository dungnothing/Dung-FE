import { Box, Button, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'
import { toast } from 'react-toastify'
import RHFInputCustom from '~/helpers/hook-form/RHFInputCustom'
import { updateInfoAPI } from '~/apis/auth'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { updateUserInfo } from '~/redux/features/comon'

const fieldConfigs = [
  { name: 'userName', label: 'Tên', defaultValue: 'Pixy', disable: false },
  { name: 'email', label: 'Email', defaultValue: 'uilib@gmail.com', disable: true },
  { name: 'phone', label: 'Số điện thoại', defaultValue: '+443322221111', disable: false },
  { name: 'organization', label: 'Tổ chức', defaultValue: 'UiLib', disable: false },
  { name: 'address', label: 'Address', defaultValue: 'Corverview, Michigan', disable: false }
]

const schema = v.object({
  userName: v.pipe(v.string()),
  email: v.pipe(v.string()),
  phone: v.pipe(v.string()),
  organization: v.pipe(v.string()),
  address: v.pipe(v.string())
})

function BasicInfo() {
  const user = useSelector((state) => state.comon.user)
  const dipatch = useDispatch()

  const form = useForm({
    resolver: valibotResolver(schema),
    defaultValues: {
      userName: '',
      email: '',
      phone: '',
      organization: '',
      address: ''
    },
    mode: 'all'
  })

  const onSubmit = async (data) => {
    try {
      const input = {
        userName: data.userName,
        phone: data.phone,
        organization: data.organization,
        address: data.address
      }
      const res = await updateInfoAPI(input)
      dipatch(updateUserInfo(input))
      toast.success(res.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleReset = () => {
    form.reset(user)
  }

  useEffect(() => {
    if (!user?.userId) return
    form.reset(user)
  }, [user])

  return (
    <FormProvider {...form}>
      <Box
        className="w-full bg-white rounded-[12px] mt-6 p-6"
        sx={{
          boxShadow:
            '0px 2px 1px -1px rgba(107, 114, 128, 0.03), 0px 1px 1px 0px rgba(107, 114, 128, 0.04), 0px 1px 3px 0px rgba(107, 114, 128, 0.08)'
        }}
      >
        <Typography variant="h6" fontWeight="600" mb={3}>
          Basic Information
        </Typography>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6">
            {fieldConfigs.map((field) => (
              <RHFInputCustom
                key={field.name}
                name={field.name}
                label={field.label}
                defaultValue={field.defaultValue}
                disabled={field.disable}
              />
            ))}
          </div>
          <Box className="flex gap-3 mt-6">
            <Button type="submit" variant="contained" sx={{ bgcolor: '#6C63FF', textTransform: 'none' }}>
              Save Changes
            </Button>
            <Button variant="outlined" sx={{ textTransform: 'none' }} onClick={handleReset}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </FormProvider>
  )
}

export default BasicInfo
